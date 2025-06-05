const { app, screen, BrowserWindow } = require('electron');
const path = require('path');

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
      nodeIntegration: true,
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

  win.on('hide', () => {
    win.show();
  });

  console.log(path.join(__dirname, 'dist', 'index.html'));
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
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