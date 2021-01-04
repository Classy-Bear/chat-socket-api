const express = require('express');
const Socket = require('socket.io');
const e = require('./modules/socket_events');

/**
 * @file index.js is the root file for this ChatApp SOCKET API.
 * @author Classy-Bear
 * @see <a href="https://github.com/Classy-Bear">Github profile</a>
 * @see {@link external:express|express}
 * @see {@link external:"Socket.IO"|Socket.IO}
 * @see {@link module:socket_events|socket_events}
 */

const PORT = process.env.PORT || 4000;
const server = express().listen(PORT);
const io = new Socket(server);
io.on('connection', (socket) => {
  socket
    .on('createdMessage', (data) => e.createdMessage(data, io))
    .on('createdUser', (data) => e.createdUser(data, socket))
    .on('deletedUser', (data) => e.deletedUser(data, socket))
    .on('updatedUser', (data) => e.updatedUser(data, socket))
    .on('askForMessage', (data) => e.askForMessage(data, io))
    .on('ack', e.ack)
});

/**
 * Creates an Express application.
 *
 * @external express
 * @see {@link https://expressjs.com/en/4x/api.html#express}
 */

/**
 * Library that enables real-time, bidirectional and event-based communication
 * between the browser and the server.
 *
 * @external "Socket.IO"
 * @see {@link https://socket.io/docs/v3/}
 */

/**
 * Promise based HTTP client for the browser and node.js
 *
 * @external axios
 * @see {@link https://www.npmjs.com/package/axios}
 */
