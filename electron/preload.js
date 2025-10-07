const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // File operations
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // Menu actions
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-new-analysis', callback);
    ipcRenderer.on('menu-open-data', (event, filePath) => callback('open-data', filePath));
    ipcRenderer.on('menu-start-detection', callback);
    ipcRenderer.on('menu-export-results', callback);
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});
