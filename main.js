var IP = "140.114.207.23";
var PORT = "8081";

var app = require('express')();
var fs = require('fs');

var server = require('http').Server(function(req, res){

    // Are such codes insecure?
    var filename = (req.url == '/' ? 'index.html' : req.url.slice(1));
    var doc = fs.readFile(filename, 'utf-8', function(err, data)
    {
        res.writeHead(200, { 'Content-Type': 'text/html',
                              'Trailer': 'Content-MD5' });
        
        if(req.url == '/') data = data.replace("###IP:PORT###", `${IP}:${PORT}`);
        res.end(data);
    });

    
    
}, app);
var io = require('socket.io')(server);
var clients = 0;

server.listen(PORT, () => console.log(`Server running on ${IP}:${PORT}`));

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