let webSocket = null;

window.onload = () => {
  const textarea = document.querySelector('#input-textarea');
  const responsePre = document.querySelector('#response-pre');

  const formatButton = document.querySelector('#format-button');
  formatButton.addEventListener('click', () => {
    const text = textarea.value;
    try {
      const json = JSON.parse(text);
      textarea.value = JSON.stringify(json, null, 2);
    } catch (error) {
      alert(error);
    }
  });

  const sendButton = document.querySelector('#send-button');
  sendButton.addEventListener('click', () => {
    console.log(webSocket.readyState);
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(textarea.value);
    } else {
      alert('Websocket connection is broken');
    }
  });

  document.querySelector('#clear-button').addEventListener('click', () => {
    responsePre.innerHTML = 'Responses will show up here';
    responsePre.setAttribute('data-updated', 'false');
  });

  document.querySelector('#connect-url-button').addEventListener('click', (event) => {
    setUrl();
    event.preventDefault();
  });
};

function setUrl() {
  const url = document.querySelector('#url-input').value;

  if (webSocket) {
    webSocket.close();
  }

  const connectionPath = `ws://${window.location.host}/${url}`;
  webSocket = new WebSocket(connectionPath);
  setStatus('connecting');

  webSocket.onmessage = (event) => {
    const parsedMsg = JSON.parse(event.data);
    switch (parsedMsg.type) {
      case 'remote_message':
        postResponseMessage(formatData(parsedMsg.data));
        break;
      case 'remote_error':
        setStatus('error');
        break;
      case 'remote_close':
        setStatus('closed');
        break;
      case 'remote_open':
        setStatus('connected');
        break;
    }
  };
}

function postResponseMessage(message) {
  const responsePre = document.querySelector('#response-pre');

  if (responsePre.getAttribute('data-updated')) {
    responsePre.removeAttribute('data-updated');
    responsePre.innerHTML = '';
  }
  const separator = getSeparator();
  responsePre.innerHTML = `${separator}<div>${message}</div>${responsePre.innerHTML}`;
}

function formatData(data) {
  if (typeof data !== 'string') {
    return data;
  }

  try {
    const parsed = JSON.parse(data);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return data;
  }
}

function getSeparator() {
  const now = new Date().toISOString();
  return `<fieldset><legend>${now}</legend></fieldset>`;
}

window.onunload = () => {
  if (webSocket) {
    webSocket.close();
  }
};

function setStatus(status) {
  const statusSpan = document.querySelector('#status-span');
  statusSpan.innerText = status;
  statusSpan.setAttribute('data-state', status);
}
