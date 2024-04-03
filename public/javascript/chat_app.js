const token = localStorage.getItem("token");
const messageInput = document.getElementById('message-input');
let chatMessage=document.getElementById('chat-messages')

document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('send-button');
    displayOnScreen();

    sendButton.addEventListener('click', function () {
        sendMessage();
        
    });
})

async function displayOnScreen(){
   const res= await axios.get("http://localhost:3000/user/chat",{headers:{"Authorization":token}})
   console.log(res.data);
   chatMessage.innerHTML = '';
   const UserId=parseJwt(token)
   
   res.data.message.forEach(element => {
    if (element!== '') {
        const messageElement = document.createElement('div');
        if(UserId.userId==element.userId){
        
        messageElement.innerHTML = `<p style="color:red;font-size: 0.875em;">you </p>${element.chat.trim()}`;
        }else{
            messageElement.innerHTML = `<p style="color:blue;font-size: 0.875em;">${element.name} </p>${element.chat.trim()}`;


        }
        messageElement.classList.add('message');
        chatMessage.appendChild(messageElement);
        
        const chatContainer = document.getElementById('chat-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
   });
   

}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}



    async function sendMessage() {

        try{
            const message=messageInput.value.trim();
        
       const res= await axios.post("http://localhost:3000/user/chat",{message},{headers:{'Authorization':token}});
       messageInput.value = '';
       displayOnScreen();
        }
        catch(error){
            console.log(error);
        }

    
    }

