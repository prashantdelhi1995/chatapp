const token = localStorage.getItem("token");
const logout = document.getElementById("Logout");
const addGroup = document.getElementById("addGroup");
const groupName = document.getElementById("GroupName");
//const members = document.getElementById("members");
const joinedGroups = document.getElementById("joinedGroups");
//const chatMessage=document.getElementById("chat-messages");
const groupMessages = document.getElementById("groupMessages")
const messageText=document.getElementById("messageText");
const sendMessageForm= document.getElementById("sendMessageForm")
let messages = [];
const MAX_MESSAGES = 10;

let selectedGroupId = null;


document.addEventListener("DOMContentLoaded", () => {
    if(!token){
        window.location.href="../html/login.html"
    }

});

logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../html/login.html"
})

// Function to fetch members
function fetchMembers() {
    return axios.get('http://localhost:3000/groupChat/allUser', { headers: { "Authorization": token } }) 
        .then(response => response.data)
        .catch(error => console.error('Error fetching members:', error));
}

function populateMembersSelect(members) {
    const selectElement = document.getElementById('members');
    

    
    selectElement.setAttribute('size', 1);

   
    selectElement.addEventListener('focus', function () {
        selectElement.setAttribute('size', 5); // Adjust as needed
    });

    selectElement.addEventListener('blur', function () {
        selectElement.setAttribute('size', 1);
    });


    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member.Id;
        option.text = member.Name;
        selectElement.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    allGroup();
    // Fetch members when the page loads
    try {
        const membersData = await fetchMembers();
        console.log(membersData);
        populateMembersSelect(membersData);
    } catch (error) {
        console.error('Error fetching members:', error);
    }
        });

    // Handle form submission
    addGroup.addEventListener('submit', async function (event) {
        event.preventDefault();
        // Extract group name from form
        const groupName = document.getElementById('groupName').value;
        console.log("groupName=", groupName);
        // Extract member usernames from form
        const selectedMembers = Array.from(document.getElementById('members').selectedOptions)
        .map(option => option.value);
        console.log("value=", selectedMembers)
        try {
          const res= await axios.post("http://localhost:3000/groupChat/creteGroup", { groupName, groupUsers:selectedMembers }, {
                headers: { "Authorization": token }
            })
            allGroup();
            alert(res.data.message)


        } catch (error) {
            alert(error.response.data.message);
            console.log(error.response.data.message);
        }


        
    })




async function allGroup() {
    joinedGroups.innerHTML = '';
    const res = await axios.get('http://localhost:3000/groupChat/allGroup', { headers: { "Authorization": token } })
    res.data.reverse().forEach(group => {
        const userGroup = document.createElement("li");
        const button = document.createElement("button");
        button.classList.add("btn", "btn-light", "btn-lg");
        button.textContent = group.groupName;
        button.addEventListener("click", async()=>{
            selectedGroupId = group.id;
            console.log(group);
            loadChat(selectedGroupId);
            
        })  
        
        userGroup.appendChild(button);
        
        
        joinedGroups.appendChild(userGroup);

    })
}
async function loadChat(id){
    
    groupMessages.innerHTML="";
    // messages=localStorage.getItem("message")||[];
    
    //     messages=JSON.parse(messages);
    
   
    let lastElement = messages.length > 0 ? messages[messages.length - 1].id : 0;
    try{
    const res = await axios.get(`http://localhost:3000/groupChat/getChat/${id}/${lastElement}`, { headers: { "Authorization": token } })
    const newMessages = res.data.messages;
    //i need to write something over here
    console.log("load chat>>>>",res.data);
    if (newMessages.length > 0) {
                    messages = [...messages, ...newMessages];
                    if (messages.length > MAX_MESSAGES) {
                        messages = messages.slice(messages.length - MAX_MESSAGES);
                    }
                    localStorage.setItem("message", JSON.stringify(messages));
                   
                }




    const userId = parseJwt(token).userId;
    messages.forEach(element=>{
        console.log("element=",element)
        const message=document.createElement("li");
        const messageText = element.chat.trim();
        let messageName = '';
        if (element.userId === userId) {
                        messageName = 'You';
                    } else {
                        messageName = element.name; // Assuming 'name' is the sender's name
                    }
                    const messageColor = element.userId === userId ? 'red' : 'blue';
    message.innerHTML=`<p style="color:${messageColor};font-size: 0.875em;">${messageName} </p>${messageText}`
    
    
    groupMessages.append(message);

    })
    
    }
    catch(error){
        console.log(error);
    }
    
}
sendMessageForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const message=messageText.value;
    sendMessage(message);
})
async function sendMessage(message) {

    if (selectedGroupId) {
        try {
            // Send message to the selected group
            await axios.post(`http://localhost:3000/groupChat/postChat`, {
                groupId: selectedGroupId,
                message: message
            }, {
                headers: { "Authorization": token }
            });
            console.log("Message sent to group:", selectedGroupId);
            loadChat(selectedGroupId)
        } catch (error) {
            console.error('Error sending message:', error);
        }
    } else {
        alert("no group is selected");
        console.error('No group selected to send message');
    }
}


//new group trying to store message on a localstorage
// let messages = [];

// const MAX_MESSAGES = 10;
// async function displayOnScreen() {
//     try {
//         groupMessages.innerHTML="";
//         let lastElement = messages.length > 0 ? messages[messages.length - 1].id : 0;

//         const res = await axios.get(`http://localhost:3000/user/chat?lastElement=${lastElement}`, {
//             headers: { "Authorization": token }
//         });

//         const newMessages = res.data.message;
//         if (newMessages.length > 0) {
//             messages = [...messages, ...newMessages];
//             if (messages.length > MAX_MESSAGES) {
//                 messages = messages.slice(messages.length - MAX_MESSAGES);
//             }
//             localStorage.setItem("message", JSON.stringify(messages));
//             renderMessages(messages);
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }

// function renderMessages(messages) {
//     chatMessage.innerHTML = '';
//     const userId = parseJwt(token).userId;

//     messages.forEach(message => {
//         const messageElement = document.createElement('div');
//         const messageText = message.chat.trim();
//         let messageName = '';

//         if (message.userId === userId) {
//             messageName = 'You';
//         } else {
//             messageName = message.name; // Assuming 'name' is the sender's name
//         }

//         const messageColor = message.userId === userId ? 'red' : 'blue';
//         messageElement.innerHTML = `<p style="color:${messageColor};font-size: 0.875em;">${messageName} </p>${messageText}`;
//         messageElement.classList.add('message');
//         chatMessage.appendChild(messageElement);
//     });
// }

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
}

