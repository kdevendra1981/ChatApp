const socket = io('http://localhost:5000');

const form = document.getElementById('send');
const messageInput = document.getElementById('typeMsg');
const messageContainer = document.querySelector('.container');
var today = new Date();
var audio = new Audio()

const append = (message, position, time) => {
    const messageElement = document.createElement('div');
    const timeElement = document.createElement('div');
    timeElement.innerText = time;
    timeElement.className = 'time'
    messageElement.innerHTML = `<span>${message}</span>`;
    messageElement.className += position;
    messageElement.className += ' box';
    messageElement.append(timeElement);
    messageContainer.append(messageElement);
    if (position == 'left') {
        console.log('playing');
        audio.src = './sound/tune.mp3';
        audio.play();
    }
}

const name = prompt("Enter your name to join chat.");
const userName = document.getElementById('username');
console.log(userName);
userName.innerText = name;
socket.emit('new-user-joined', name);

if (name != '') {
    function getTime() {
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        dateTime = ':' + date + ' - ' + time;
        return dateTime
    }
    const sendbtn = document.getElementById('sendbtn')
    TextMsg = document.getElementById('textMsg');
    sendbtn.addEventListener('click', e => {
        e.preventDefault();
        msg = TextMsg.value;
        TextMsg.value = '';
        socket.emit('send', msg)
        append(`${msg}: You`, 'right', getTime())
    });

    let textBox = document.getElementById('textMsg');
    textBox.addEventListener("keyup", function (event) {
        console.log('keyup event fired');
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("sendbtn").click();

        }
    });

    socket.on('user-joined', data => {
        append(`${data.username}: Joined the Chat`, 'left', data.time)
    });
    socket.on('receive', data => {
        append(`${data.message}: ${data.username}`, 'left', data.time)
    });

    socket.on('left', data => {
        append(`${data.user} left the chat`, 'left', data.time)
    });
}