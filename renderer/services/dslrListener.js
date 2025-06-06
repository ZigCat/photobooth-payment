const { EventEmitter } = require('events');
const http = require('http');
const { BrowserWindow } = require('electron');
const dslrEvents = new EventEmitter();

const sendLogToRenderer = (message, level = 'info') => {
  const win = BrowserWindow.getAllWindows()[0];
  if (win) {
    win.webContents.send('main-log', { message, level, timestamp: new Date().toISOString() });
  }
  console.log(`[MAIN] ${message}`);
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const eventType = url.searchParams.get('event_type');

  if (eventType) {
    if(eventType === 'session_start' || eventType === 'session_end') {
        sendLogToRenderer(`Received event from DSLR: ${eventType}`);
    }
    dslrEvents.emit(eventType);

    const { BrowserWindow } = require('electron');
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      win.webContents.send('dslr-event', eventType);
    }
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Event received');
});

server.listen(8001, () => {
  sendLogToRenderer('DSLR listener running on port 8001');
});

module.exports = { dslrEvents };