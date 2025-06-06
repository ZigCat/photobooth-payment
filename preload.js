const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dslrAPI', {
  onEvent: (callback) => {
    console.log('Setting up DSLR event listener');
    return ipcRenderer.on('dslr-event', (_event, eventType) => {
      if(eventType === 'session_start' || eventType === 'session_end') {
        console.log(`Received DSLR event: ${eventType}`);
        callback(eventType);
      }
    });
  },

  onMainLog: (callback) => {
    return ipcRenderer.on('main-log', (_event, logData) => {
      callback(logData);
    });
  }
});

contextBridge.exposeInMainWorld('dslrAPIReady', true);