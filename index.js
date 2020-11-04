import * as e from './modules/socket_events';

const express = require('express');
const Socket = require('socket.io');

const PORT = 4000;
const app = express();
const server = app.listen(PORT);
const io = new Socket(server);
io.on('connection', (socket) => {
  socket.on('save', (data) => e.onSave(data, io));
  socket.on('ask for message', (data) => e.askForMessage(data, io));
  socket.on('ack', e.ack);
  socket.on('connected', (data) => e.connected(data, socket));
  socket.on('disconnected', (data) => e.disconnected(data, socket));
});
