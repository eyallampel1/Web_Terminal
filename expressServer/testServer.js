const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001');

socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('execute command', 'ls');  // Replace 'pwd' with your command
});

socket.on('command output', (data) => {
    console.log('Command output:', data);
});