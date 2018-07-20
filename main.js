var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var clients = 0;

server.listen(8081, () => console.log('Server running on port 8081'));

function updateAllClients(name, msg)
{
    console.log(name + " says: " + msg);
    io.sockets.emit('update', name, msg);
}

function updateOnlineCounts()
{
    io.sockets.emit('userCount', clients);
}

io.sockets.on('connection', function(socket)
{
    clients++;
    console.log('A USER CONNECTED');

    socket.once('disconnect', function()
    {
        clients--;
        console.log('A USER DISCONNECTED');
        updateOnlineCounts();
    });

    socket.on('init', function(parameter, callback)
    {
        callback();
    });

    socket.on('msgpost', function(name, msg, callback){
        updateAllClients(name, msg);
        callback(null);
    });

    socket.on('check', function(callback){
        callback(null, true);
    });

    updateOnlineCounts();
});