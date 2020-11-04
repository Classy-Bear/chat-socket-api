const express = require('express');
const Socket = require('socket.io');
const {
  onSave, askForMessage, connected, ack, disconnected,
} = require('./modules/socket_events');

const PORT = 4000;
const app = express();
const server = app.listen(PORT);
const io = new Socket(server);
io.on('connection', (socket) => {
  socket.on('save', (data) => onSave(data, io));
  socket.on('ask for message', (data) => askForMessage(data, io));
  socket.on('ack', ack);
  socket.on('connected', (data) => connected(data, socket));
  socket.on('disconnected', (data) => disconnected(data, socket));
});
