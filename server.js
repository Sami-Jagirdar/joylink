// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const os = require('os');

// Get local IP address for LAN accessibility
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    for (let i = 0; i < interfaces[devName].length; i++) {
      const iface = interfaces[devName][i];
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // fallback to localhost if no LAN IP found
};

// Create the Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIo(server);

// Serve static files (client-side HTML, CSS, JS)
app.use(express.static('client/src'));

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('joystick-move', (data) => {
    console.log('Joystick moved:', data);
    // Handle joystick data here (e.g., broadcast to other clients)
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Get the local IP address for LAN access
const localIP = getLocalIP();
const port = 5001;
server.listen(port, localIP, () => {
  console.log(`Server running at http://${localIP}:${port}`);
});
