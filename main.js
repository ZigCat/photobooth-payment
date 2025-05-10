const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 300,
    x: 0,
    y: 0,
    frame: false,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
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