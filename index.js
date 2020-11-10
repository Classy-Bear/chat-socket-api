const express = require('express');
const Socket = require('socket.io');
const {
  onSave, askForMessage, connected, ack, disconnected,
} = require('./modules/socket_events');

const PORT = process.env.PORT || 4000;
const app = express();
const server = app.listen(PORT);
const io = new Socket(server);
io.on('connection', (socket) => {
  socket
    .on('save', (data) => onSave(data, io))
    .on('ask for message', (data) => askForMessage(data, io))
    .on('ack', ack)
    .on('connected', (data) => connected(data, socket))
    .on('disconnected', (data) => disconnected(data, socket));
});
