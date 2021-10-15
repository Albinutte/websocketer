import * as history from './history.js';

// todo [albina]: add "history" tab (with "clear history" option)

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

  document.querySelector('#send-button').addEventListener('click', () => {
    sendMessage();
  });

  document.querySelector('#clear-button').addEventListener('click', () => {
    responsePre.innerHTML = 'Responses will show up here';
    responsePre.setAttribute('data-updated', 'false');
  });

  document.querySelector('#connect-url-button').addEventListener('click', (event) => {
    event.preventDefault();
    setUrl();
  });

  textarea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      sendMessage();
    }
  });

  setUpTabs();
};

let buttonStateResetTimeout = null;
function sendMessage() {
  if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
    alert('Websocket connection is down');
    return;
  }

  const msg = document.querySelector('#input-textarea').value;
  webSocket.send(document.querySelector('#input-textarea').value);
  history.saveMessage(msg);

  const button = document.querySelector('#send-button');
  if (buttonStateResetTimeout) {
    clearTimeout(buttonStateResetTimeout);
  }
  button.classList.replace('btn-primary', 'btn-success');
  button.innerText = 'Sent!';
  buttonStateResetTimeout = setTimeout(() => {
    button.classList.replace('btn-success', 'btn-primary');
    button.innerText = 'Send';
  }, 2000);
}

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

  webSocket.onerror = () => setStatus('error');

  webSocket.onclose = () => setStatus('closed');
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
  return `<fieldset><legend>${new Date().toISOString()}</legend></fieldset>`;
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

function setUpTabs() {
  const sendMsgTab = document.querySelector('#send-msg-tab');
  const historyTab = document.querySelector('#history-tab');

  const sendMsgTabContent = document.querySelector('#send-msg-tab-content');
  const historyTabContent = document.querySelector('#history-tab-content');

  sendMsgTab.addEventListener('click', () => {
    historyTab.classList.remove('active');
    historyTabContent.classList.add('visually-hidden');
    sendMsgTab.classList.add('active');
    sendMsgTabContent.classList.remove('visually-hidden');
  });

  historyTab.addEventListener('click', () => {
    sendMsgTab.classList.remove('active');
    sendMsgTabContent.classList.add('visually-hidden');
    historyTab.classList.add('active');
    historyTabContent.classList.remove('visually-hidden');
  });
}
