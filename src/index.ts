import express from 'express';
import http from 'http';
import path from 'path';

import { configure as configureWebsockets } from './websockets';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

const app = express();
app.use(express.static(path.join(__dirname, '..', 'public')));

const server = http.createServer(app);

async function startUp() {
  await configureWebsockets(server);

  server.listen(PORT, null, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

startUp();
