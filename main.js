const { app, screen, BrowserWindow } = require('electron');
const path = require('path');

console.log('Initializing DSLR listener...');
const dslrListener = require('./dslrListener');
console.log('DSLR listener initialized');

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const screenWidth = display.bounds.width;

  const win = new BrowserWindow({
    width: screenWidth,
    height: 300,
    x: 0,
    y: 0,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    skipTaskbar: false,
    alwaysOnTop: true,
    focusable: true,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true);
  win.setFullScreenable(false);

  win.on('minimize', (e) => {
    e.preventDefault();
    win.restore();
  });

  win.on('blur', () => {
    win.focus();
  });

  console.log(path.join(__dirname, 'dist', 'index.html'));
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));

  dslrListener.dslrEvents.on('session_start', () => {
    console.log('Hiding window on session_start');
    win.webContents.send('dslr-event', 'session_start');
    win.hide();
  });

  dslrListener.dslrEvents.on('session_end', () => {
    console.log('Showing window on session_end');
    win.webContents.send('dslr-event', 'session_end');
    win.show();
    win.focus();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});