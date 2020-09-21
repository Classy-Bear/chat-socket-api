const express = require('express');
const socket = require('socket.io');
const api_fetcher = require('./api/api_fetcher');

const PORT = 4000;

// Build HTTP server
const app = express();
const server = app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

// Upgrade HTTP server to socket
const io = new socket(server);
io.on('connection', (socket) => {
    socket.on('save', async (data) => {
        // POST the message
        await api_fetcher.sendMessage(
            data['message'], 
            data['sender'], 
            data['receiver'],
        );
        // Is the receiver online?
        io.emit(data['receiver']);
    });
    socket.on('ask for message', async (data) => {
        // GET the message, because the user is online.
        const messages = await api_fetcher.getById('messages/sender_receiver', `${data['sender']}&${data['receiver']}`);
        // Emit the messages and deliver it to the message receiver. Here you go :) 
        io.emit(data['receiver'], messages);
    });
    socket.on('ack', async (data) => {
        // The user receive the message
        // DELETE the message from DB.
       await api_fetcher.delete('messages', data);
    });
    // socket.on('connected', async (id) => {
    //     const user = await api_fetcher.getById('users', id);
    //     socket.broadcast.emit('user connected', user['user']);
    // });

    // socket.on('disconnected', async (id) => {
    //     const user = await api_fetcher.getById('users', id);
    //     socket.broadcast.emit('user disconnected', user['user']);
    // });
});

