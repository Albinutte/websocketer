const connectionPath = `ws://${window.location.host}/ws://129.132.28.188:49152`;

const webSocket = new WebSocket(connectionPath);

window.onload = () => {
  const textarea = document.querySelector('#input-textarea');
  const responsePre = document.querySelector('#response-pre');

  const formatButton = document.querySelector('#format-button');
  formatButton.addEventListener('click', () => {
    const text = textarea.value;
    const json = JSON.parse(text);
    textarea.value = JSON.stringify(json, null, 2);
  });

  const sendButton = document.querySelector('#send-button');
  sendButton.addEventListener('click', () => {
    webSocket.send(textarea.value);
  });

  webSocket.onmessage = (event) => {
    if (responsePre.getAttribute('data-updated')) {
      responsePre.removeAttribute('data-updated');
      responsePre.innerHTML = '';
    }
    const message = formatMessage(event.data);
    const separator = getSeparator();
    responsePre.innerHTML = `${separator}<div>${message}</div>${responsePre.innerHTML}`;
  };
};

function formatMessage(message) {
  const parsedMsg = JSON.parse(message);
  switch (parsedMsg.type) {
    case 'remote_message':
      return formatData(parsedMsg.data);
    default:
      return parsedMsg;
  }
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
  webSocket.close();
};
