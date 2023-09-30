// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",  // Allow requests from your React app
        methods: ["GET", "POST"]
    }
});


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('execute command', (command) => {
        console.log('Command received:', command);  // log the received command
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log('Error:', error.message);  // log the error
                socket.emit('command output', error.message);
                return;
            }
            console.log('Response:', stdout || stderr);  // log the response
            socket.emit('command output', stdout || stderr);
        });
    });
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});