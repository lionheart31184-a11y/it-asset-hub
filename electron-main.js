const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let server;

function waitForPort(port, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const net = require('net');
    const deadline = Date.now() + timeout;
    function check() {
      const sock = new net.Socket();
      sock.setTimeout(1000);
      sock.on('connect', () => { sock.destroy(); resolve(); });
      sock.on('timeout', () => { sock.destroy(); check(); });
      sock.on('error', () => {
        if (Date.now() > deadline) reject(new Error('Server timeout'));
        else setTimeout(check, 500);
      });
      sock.connect(port, '127.0.0.1');
    }
    check();
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'IT Asset Hub',
    webPreferences: { nodeIntegration: false, contextIsolation: true },
  });
  win.loadURL('http://localhost:3000');
  win.setMenuBarVisibility(false);
  win.on('closed', () => app.quit());
}

app.whenReady().then(async () => {
  // Start backend server as detached child process
  server = spawn(
    process.argv0,
    [path.join(__dirname, 'auth_server.js')],
    {
      detached: true,
      stdio: 'ignore',
      cwd: __dirname,
    }
  );
  server.unref();

  try {
    await waitForPort(3000, 15000);
    createWindow();
  } catch (e) {
    console.error('Failed to start backend server:', e.message);
    app.quit();
  }

  app.on('window-all-closed', () => app.quit());
});