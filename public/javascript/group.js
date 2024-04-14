const token = localStorage.getItem("token");
const logout = document.getElementById("Logout");
const addGroup = document.getElementById("addGroup");
const groupName = document.getElementById("GroupName");

const joinedGroups = document.getElementById("joinedGroups");

const groupMessages = document.getElementById("groupMessages")
const messageText=document.getElementById("messageText");
const sendMessageForm= document.getElementById("sendMessageForm")
const addAdmin=document.getElementById("admin")
const leftGroup=document.getElementById("leftGroup");
const groupLeft=document.getElementById("groupLeft");
const addMember=document.getElementById("addMember")
const fileInput=document.getElementById("file-input");
const socket = io("http://35.154.147.16/://:5000");
socket.on("data", (data) => {
  console.log(data);
});

const MAX_MESSAGES = 10;

let selectedGroupId = null;




logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../html/login.html"
})

// Function to fetch members
function fetchMembers() {
    return axios.get('/groupChat/allUser', { headers: { "Authorization": token } }) 
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
    if(!token){
        window.location.href="../html/login.html"
    }

    if(selectedGroupId==null ){
                
        addAdmin.style.visibility="hidden";
        groupLeft.style.visibility="hidden";
        addMember.style.visibility="hidden";

    }

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
          const res= await axios.post("/groupChat/creteGroup", { groupName, groupUsers:selectedMembers }, {
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
    const res = await axios.get('/groupChat/allGroup', { headers: { "Authorization": token } })
    res.data.reverse().forEach(group => {
        const userGroup = document.createElement("li");
        const button = document.createElement("button");
        button.classList.add("btn", "btn-light", "btn-lg", "info-button"); // Add info-button class
        button.textContent = group.group.groupName;
        button.style.width = '300px'; // Set the width to 100 pixels
        button.style.height = '50px';
        button.style.padding="1opx"
        button.addEventListener("click", async()=>{
            selectedGroupId = group.group.id;
            
            if(selectedGroupId ){
                addAdmin.style.visibility="visible";
                groupLeft.style.visibility="visible";
                addMember.style.visibility="visible";

            }
            if(group.isAdmin==false ){
                addAdmin.style.visibility="hidden";
                addMember.style.visibility="visible";
            }
           loadChat(selectedGroupId);
        });

        const infoButton = document.createElement("button"); // Create info button
        infoButton.classList.add("btn", "btn-info", "btn-sm", "ml-2"); // Add classes for styling
        infoButton.textContent = "Info";
        infoButton.addEventListener("click", () => openGroupInfoModal(group.group.id)); // Add click event listener

        userGroup.appendChild(button);
        userGroup.appendChild(infoButton); // Append info button to the group item

        joinedGroups.appendChild(userGroup);
    })
}
 

// async function loadChat(id){
//     groupMessages.innerHTML="";

//     let storedMessages = localStorage.getItem(id);
//     storedMessages = storedMessages ? JSON.parse(storedMessages) : [];
    
//     const lastStoredMessage = storedMessages.length > 0 ? storedMessages[storedMessages.length - 1].id : 0;
    
//     try {
//         const res = await axios.get(`http://localhost:3000/groupChat/getChat/${id}/${lastStoredMessage}`, { headers: { "Authorization": token } })
//         const newMessages = res.data.messages;

//         if (newMessages.length > 0) {
//             // Append new messages to stored messages
//             storedMessages.push(...newMessages);
            
//             // Keep only the latest 10 messages
//             if (storedMessages.length > MAX_MESSAGES) {
//                 storedMessages = storedMessages.slice(storedMessages.length - MAX_MESSAGES);
//             }
            
//             // Update local storage
//             localStorage.setItem(id, JSON.stringify(storedMessages));
//         }

//         const userId = parseJwt(token).userId;
//         storedMessages.forEach(element => {
//             if (element.groupId == id) {
//                 const message = document.createElement("li");
//                 const messageText = element.chat.trim();
//                 let messageName = '';
                
//                 if (element.userId === userId) {
//                     messageName = 'You';
//                 } else {
//                     messageName = element.name; // Assuming 'name' is the sender's name
//                 }
                
//                 const messageColor = element.userId === userId ? 'red' : 'blue';
//                 message.innerHTML = `<p style="color:${messageColor};font-size: 0.875em;">${messageName} </p>${messageText}`
                
//                 groupMessages.append(message);
//             }
//         });
//     } catch(error) {
//         console.log(error);
//     }
// }



async function loadChat(id){
    

    
    try {
        
        socket.emit("getMessages", id);
        socket.on("messages", (messages) => {
            groupMessages.innerHTML="";
       

        const userId = parseJwt(token).userId;
        messages.forEach(element => {
            console.log("element==",element)

            if (element.groupId == id) {
                
                const message = document.createElement("li");
                const messageText = element.chat.trim();
                let messageName = '';
                
                if (element.userId === userId) {
                    messageName = 'You';
                } else {
                    messageName = element.name; // Assuming 'name' is the sender's name
                }
                const messageColor = element.userId === userId ? 'red' : 'blue';
                if(element.ImageUrl==false){
                
                message.innerHTML = `<p style="color:${messageColor};font-size: 0.875em;">${messageName}</p><p>${element.createdAt.substring(0, 10)} </p><p>${messageText}</p>`
                groupMessages.append(message);
                }
                else{
                    const div =document.createElement("div")
                    div.style.width="200px"
                    div.style.height="150px"
                    div.innerHTML=`<p style="color:${messageColor};font-size: 0.875em;">${messageName}</p>
                     <p><img width="200" height="150"src=${messageText} /></p>
                     ${element.createdAt.substring(0, 10)}`
                     groupMessages.append(div);
                }
            }
        });})
    } catch(error) {
        console.log(error);
    }
}

sendMessageForm.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const file=fileInput.files[0];
        
    if(file){
        sendImage(file)
       


        sendMessageForm.reset();

   
    }
    else{
        const message=messageText.value;
        sendMessage(message);
        messageText.value="";

        
    }
})
async function sendMessage(message) {

    if (selectedGroupId) {
        try {
            // Send message to the selected group
            await axios.post(`/groupChat/postChat`, {
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

async function sendImage(file){
    if(selectedGroupId){
    try {
        const formData=new FormData();
        formData.append("file", file);
        const response = await axios.post(`/groupChat/uploadImage/${selectedGroupId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization":token

          }
        });
        console.log('File uploaded successfully:', response.data);
        loadChat(selectedGroupId)
        
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    else{
        alert("please select any group");
    }


}




function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
}

function openGroupInfoModal(groupId) {
    // Fetch group members and populate the modal
    axios.get(`/groupChat/getMember?groupId=${groupId}`,{headers:{"Authorization":token}})
    .then(response => {
        const members = response.data.allMember;
        console.log("members=",members)
        const modalBody = document.querySelector('#groupInfoModal .modal-body');
        const form = document.createElement('form');
        form.id = 'groupInfoForm';

        members.forEach(member => {
            console.log("member--",member)
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = member.userName;

            
            checkbox.value = member.userId;
            if (member.groupId==groupId) {
                checkbox.checked = true;
                checkbox.disabled = true; // Disable checkbox if user is already a member
            }
            
            const label = document.createElement('label');
            label.textContent = member.isAdmin==true?member.userName+"(Admin)": member.userName;

            const div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(label);

            form.appendChild(div);
        });

        modalBody.innerHTML = ''; // Clear previous content
        modalBody.appendChild(form);

        
        
    })
    .catch(error => {
        console.error('Error fetching group members:', error);
    });

    // Show the modal
    $('#groupInfoModal').modal('show');
}


// Function to open admin assignment modal
function openAdminAssignmentModal() {
    const groupId = selectedGroupId; // Assuming selectedGroupId is the ID of the currently viewed group
    populateAdminAssignmentModal(groupId);
    $('#adminAssignmentModal').modal('show');
}

// Function to fetch group members and populate admin assignment modal
function populateAdminAssignmentModal(groupId) {
    axios.get(`/groupChat/getMember?groupId=${groupId}`, { headers: { "Authorization": token } })
        .then(response => {
            const members = response.data.allMember;
            const modalBody = document.querySelector('#adminAssignmentModal .modal-body');
            modalBody.innerHTML = ''; // Clear previous content

            members.forEach(member => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = member.userId;
                checkbox.checked = member.isAdmin; // Check if the user is already an admin
                checkbox.disabled = member.isAdmin; // Disable checkbox if user is already an admin

                const label = document.createElement('label');
                label.textContent = member.userName;

                const div = document.createElement('div');
                div.appendChild(checkbox);
                div.appendChild(label);

                modalBody.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error fetching group members:', error);
        });
}

// Handle form submission for admin assignment
document.getElementById('addAdminButton').addEventListener('click', async function (event) {
    event.preventDefault();

    const selectedUserIds = Array.from(document.querySelectorAll('#adminAssignmentModal .modal-body input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    const groupId = selectedGroupId; // Assuming selectedGroupId is the ID of the currently viewed group
    
    // Call function to assign admin privileges
    await assignAdmins(groupId, selectedUserIds);
});

async  function assignAdmins(groupId,selectedGroupIds){
    const obj={
        groupId,
        selectedGroupIds
        
    }
    console.log("obj" ,obj)
    try{
  const res=  await axios.post(`/groupChat/addAdmins/`,obj, {headers:{"Authorization":token}})
  console.log("admin response",res.data.data);
  alert(res.data);
    }
  catch(error){
    console.log(error);
  }


}


function openAddMemberModel() {
    const groupId = selectedGroupId; // Assuming selectedGroupId is the ID of the currently viewed group
    populateAddMemberModel(groupId);
    $('#addMemberGroup').modal('show');
}

// i will edit this code and i will provide nonmember to this code  
function populateAddMemberModel(groupId) {
    axios.get(`/groupChat/nonMember?groupId=${groupId}`, { headers: { "Authorization": token } })
        .then(response => {
            const members = response.data.nonGroupMembers
            console.log("member==",members);
            const modalBody = document.querySelector('#addMemberGroup .modal-body');
            modalBody.innerHTML = ''; // Clear previous content

            members.forEach(member => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = member.Id;
                 

                const label = document.createElement('label');
                label.textContent = member.Name;

                const div = document.createElement('div');
                div.appendChild(checkbox);
                div.appendChild(label);

                modalBody.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error fetching group members:', error);
        });
}

document.getElementById('addMemberButton').addEventListener('click', async function (event) {
    event.preventDefault();

    const selectedUserIds = Array.from(document.querySelectorAll('#addMemberGroup .modal-body input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    const groupId = selectedGroupId; // Assuming selectedGroupId is the ID of the currently viewed group
    
    // Call function to assign admin privileges
    await assignMember(groupId, selectedUserIds);
});

async  function assignMember(groupId,selectedUserIds){
    const obj={
        groupId,
        selectedUserIds
        
    }
    console.log("obj" ,obj)
    try{
  const res=  await axios.post(`/groupChat/addMember`,obj, {headers:{"Authorization":token}})
  console.log("member response",res.data);
  alert(res.data.message);
  $('#addMemberGroup').modal('hide');
    }
  catch(error){
    console.log(error);
  }
}
//left Group code
leftGroup.addEventListener("click",async()=>{
    try{
    alert("are you sure you want to left this group");
    const res= await axios.delete(`/groupChat/leftGroup/${selectedGroupId}`,{headers:{"authorization":token}});
    console.log("you left this group",res.data);
    allGroup();
    }
    catch(error){
        console.log(error);
    }

})



