// Node modules.
const express = require("express");
const socket = require("socket.io");
// Local modules.
const SocketsEvents = require("./api/socket_events");

const PORT = 4000;

// Build the HTTP server.
const app = express();
const server = app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

// Upgrade the HTTP server to a WebSocket server.
const io = new socket(server);

const e = new SocketsEvents();

// Sockets listeners.
io.on("connection", (socket) => {
  socket.on("save", (data) => e.onSave(data, io));
  socket.on("ask for message", (data) => e.askForMessage(data, io));
  socket.on("ack", e.ack);
  socket.on("connected", (data) => e.connected(data, socket));
  socket.on("disconnected", (data) => e.disconnected(data, socket));
});
