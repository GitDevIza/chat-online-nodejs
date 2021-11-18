/*const path = require('path');
const express = require('express');
const app = express();

//settings
app.set('port', process.env.PORT || 3000);

//static files
app.use(express.static(path.join(__dirname,'public')));

const server = app.listen(app.get('port'), () => {
	console.log('server on port', app.get('port'));
});

//websockets
const SocketIO = require('socket.io');
const io = SocketIO(server);

io.on('connection', (socket) => {
	console.log("new connection", socket.id);

	socket.on('chat:message', (data) => {
		io.sockets.emit('chat:message',data);
	});

	socket.on('chat:typing', (data)=>{
		socket.broadcast.emit('chat:typing', data);
	});
});*/
const http = require('http');
const path = require('path');

const express = require('express');
const SocketIO = require('socket.io');

const mongoose = require('mongoose');
const mysql = require('mysql');
//const myConnection = require('express-myconnection');

const app = express();
const server = http.createServer(app);
const io = SocketIO.listen(server);

//db connection
mongoose.connect('mongodb://localhost:27017/chat-database', { useNewUrlParser: true, useUnifiedTopology: true });/*.then(db => console.log('db is connected')).catch(err => console.log('db connection have error', err));*/
mongoose.connection.on('open', _ =>{
	console.log('Database is connected to', 'localhost');
});
mongoose.connection.on('error', err =>{
	console.log('Error Conected', err);
});

//socket.js
require('./sockets')(io);

// settings
app.set('port', process.env.PORT || 3000);

// static files
app.use(express.static(path.join(__dirname,'public')));

//starting the server
server.listen(app.get('port'), ()=>{
	console.log('Server on port:',app.get('port'));
});
// -------------
app.get('/', (req, res)=>{
	res.send('hellow');
});