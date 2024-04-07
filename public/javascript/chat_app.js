const token = localStorage.getItem("token");
const messageInput = document.getElementById('message-input');
const chatMessage = document.getElementById('chat-messages');
let messages = [];

const MAX_MESSAGES = 10;

document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('send-button');
    displayOnScreen();

    sendButton.addEventListener('click', function () {
        sendMessage();
    });

    setInterval(displayOnScreen, 1000);
});

async function displayOnScreen() {
    try {
        let lastElement = messages.length > 0 ? messages[messages.length - 1].id : 0;

        const res = await axios.get(`http://localhost:3000/user/chat?lastElement=${lastElement}`, {
            headers: { "Authorization": token }
        });

        const newMessages = res.data.message;
        if (newMessages.length > 0) {
            messages = [...messages, ...newMessages];
            if (messages.length > MAX_MESSAGES) {
                messages = messages.slice(messages.length - MAX_MESSAGES);
            }
            localStorage.setItem("message", JSON.stringify(messages));
            renderMessages(messages);
        }
    } catch (error) {
        console.error(error);
    }
}

function renderMessages(messages) {
    chatMessage.innerHTML = '';
    const userId = parseJwt(token).userId;

    messages.forEach(message => {
        const messageElement = document.createElement('div');
        const messageText = message.chat.trim();
        let messageName = '';

        if (message.userId === userId) {
            messageName = 'You';
        } else {
            messageName = message.name; // Assuming 'name' is the sender's name
        }

        const messageColor = message.userId === userId ? 'red' : 'blue';
        messageElement.innerHTML = `<p style="color:${messageColor};font-size: 0.875em;">${messageName} </p>${messageText}`;
        messageElement.classList.add('message');
        chatMessage.appendChild(messageElement);
    });
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
}

async function sendMessage() {
    try {
        const message = messageInput.value.trim();
        if (message !== '') {
            const res = await axios.post("http://localhost:3000/user/chat", { message }, { headers: { 'Authorization': token } });
            messageInput.value = '';
            displayOnScreen();
        }
    } catch (error) {
        console.error(error);
    }
}
