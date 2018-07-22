var socket = null;
var errorStatus = "Connection error. Trying to reconnect...";
var successStatus = "Connected!";

// try to connect
setTimeout("init()", 500);

function init()
{
    // Bind submit function
    $(function(){
        $('#msg').keydown(function(e){
            if(e.keyCode == '13' && !e.shiftKey)
            {
                msgPost();
            }
        });
    });
    
    socket = io.connect("http://" + ipInput.value);

    // necessary to assign callback
    socket.on('connect', function() {
        
        connectStatus.innerHTML = successStatus;
        socket.emit('init', null, function() {
            changeName();
        });
    });

    socket.on('connect_error', function() {
        connectStatus.innerHTML = errorStatus;
    });

    socket.on('update', function(name, msg)
    {
        var newLine =`<b><font color='#378ab3'>${name}</b></font>: ${msg}<br/>`;// name + ": " + msg + "\n";
        record.innerHTML += newLine;
        record.scrollTop = record.scrollHeight;
    });

    socket.on('userCount', function(data)
    {
        userCounter.innerHTML = data;
        console.log(data);
    });

    // Check connection regularly
    setTimeout("checkConnection()", 5000);
}


function msgPost()
{
    var msgstr = msg.value;
    while(msgstr.startsWith(' ') || msgstr.startsWith('\n') ||
          msgstr.endsWith(' ') || msgstr.endsWith('\n'))
    {
        msgstr = msgstr.trim();
        while(msgstr.endsWith('\n')) msgstr = msgstr.slice(0, -1);
        while(msgstr.startsWith('\n')) msgstr = msgstr.slice(1);
    }
    
    if(msgstr == '') return;


    while(msgstr.includes("\n")) msgstr = msgstr.replace("\n", "<br/>");

    socket.emit('msgpost', nameDisplay.innerHTML, msgstr, function(err)
    {
        if(err == null) msg.value = "";
        else connectStatus.innerHTML = errorStatus;
    });
    
}

function changeName()
{
    var newName = document.getElementById('name').value;
    nameDisplay.innerHTML = newName != '' ? newName : 'user';
}

function clearMsg()
{
    record.value = "";
}

function checkConnection()
{
    console.log("Check Connection");
    socket.emit('check', function(err, suc){
        if(err != null) connectStatus.innerHTML = errorStatus;
        else connectStatus.innerHTML = successStatus;
    });

    setTimeout("checkConnection()", 5000);
}