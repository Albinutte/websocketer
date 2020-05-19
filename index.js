const WebSocket = require('ws');
const blessed = require('blessed');

const address = process.argv[2];
const ws = new WebSocket(address);

const screen = blessed.screen();
const body = blessed.box({
  top: 0,
  left: 0,
  height: '100%-1',
  width: '100%',
  keys: true,
  mouse: true,
  alwaysScroll: true,
  scrollable: true,
  scrollbar: {
    ch: ' ',
    bg: 'red'
  },
  border: {
  	type: 'line'
  }
});
const inputBar = blessed.textbox({
  bottom: 0,
  left: 0,
  height: 1,
  width: '100%',
  keys: true,
  mouse: true,
  inputOnFocus: true,
  style: {
    fg: 'white',
    bg: 'blue'
  }
});

function log(text) {
  body.pushLine(text);
  screen.render();
}

function logMessage(message, { incoming, outgoing }) {
	const timestamp = new Date().toISOString();
	log('');
	log(`${timestamp}::${incoming ? '<' : ''}${'-'.repeat(50)}${outgoing ? '>' : ''}`);
	log(JSON.stringify(message, null, 2));
}


screen.append(body);
screen.append(inputBar);
inputBar.focus();


inputBar.key(['escape', 'C-c'], () => (process.exit(0)));


inputBar.on('submit', (text) => {
	try {
		const message = JSON.parse(text);
		ws.send(text);
		logMessage(message, { outgoing: true });
	} catch (error) {
		log(error.toString());
	}
  inputBar.clearValue();
  inputBar.focus();
});


log('Waiting for connection to get established...');


ws.on('open', function open() {
	log('Connection established.\n\n');
});

ws.on('message', function incoming(data) {
	try {
		const message = JSON.parse(data);
		logMessage(message, { incoming: true });
	} catch (error) {
		log(error.toString());
	}
});

ws.on('close', () => {
	log('Connection closed.');
	process.exit(1);
});

ws.on('error', (error) => {
	log(error.toString());
});
