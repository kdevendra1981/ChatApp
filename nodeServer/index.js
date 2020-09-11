//to handle nodejs socket
const io = require('socket.io')(5000);

const user={};

var today = new Date();
function getTime(){
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    dateTime = ':'+ date+' - '+time;
    return dateTime
}

io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        user[socket.id]=name;
        data ={username:name, time:getTime()}
        socket.broadcast.emit('user-joined',data)
    });
    socket.on('send',message =>{
       socket.broadcast.emit('receive',{message: message, username: user[socket.id], time:getTime()})
    });
    socket.on('disconnect',message =>{
       socket.broadcast.emit('left',{user:user[socket.id],time:getTime()});
       delete user[socket.id];
    });
})

