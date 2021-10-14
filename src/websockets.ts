import WebSocket, { Server as WebSocketServer } from 'ws';
import { Server as HttpServer } from 'http';

export async function configure(server: HttpServer) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req) => {
    const remoteAddress = req.url.split('/').slice(1).join('/');
    const remoteWs = new WebSocket(remoteAddress);
    configureRemoteConnection(remoteWs, ws);
    configureLocalConnection(ws, remoteWs);
  });
}

function configureRemoteConnection(remoteWs: WebSocket, ws: WebSocket) {
  remoteWs.on('open', () => {
    ws.send(JSON.stringify({ type: 'remote_open' }));
  });

  remoteWs.on('message', (data) => {
    ws.send(
      JSON.stringify({
        type: 'remote_message',
        data,
      })
    );
  });

  remoteWs.on('error', (data) => {
    ws.send(
      JSON.stringify({
        type: 'remote_error',
        data,
      })
    );
  });

  remoteWs.on('close', (data) => {
    ws.send(
      JSON.stringify({
        type: 'remote_close',
        data,
      })
    );
  });
}

function configureLocalConnection(ws: WebSocket, remoteWs: WebSocket) {
  ws.on('close', () => {
    remoteWs.close();
  });

  ws.on('error', () => {
    remoteWs.close();
  });

  ws.on('message', (data) => {
    remoteWs.send(data);
  });
}
