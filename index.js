const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Path to your Node.js server file
const serverPath = path.join(__dirname, 'server.js');

// Function to create the Electron window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadURL('http://localhost:5001');  // Assuming the server is running locally on port 5001

  win.loadFile('index.html');

  win.on('closed', () => {
    win = null;
  });
}

// Start the server in the background when the Electron app launches
app.whenReady().then(() => {
  // Spawn the server (Node.js) as a child process
  const server = spawn('node', [serverPath]);

  server.stdout.on('data', (data) => {
    console.log(`Server: ${data.toString()}`);
  });

  server.stderr.on('data', (data) => {
    console.error(`Server Error: ${data.toString()}`);
  });

  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });

  // Create the Electron window after starting the server
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
