let token=localStorage.getItem("token")
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
   

    const formData = new FormData(this);

    axios.post('http://localhost:3000/user/login', {
      
        email: formData.get('email'),
        password: formData.get('password')
    })
    .then(function(response) {
        //console.log('login successful:', response.data);
        if(response.status==200){
        alert('login successful!');
        console.log(response.data)
        localStorage.setItem("token",response.data.token)
        //window.location.href = '../html/expense.html';
        document.getElementById('email').value = "";
        document.getElementById('password').value = "";

        }
        else{
               alert(response.data)

        }
         
    }).catch(function(error) {
        alert("incorrect email or password ",error)
     
        
    });
});
window.addEventListener("DOMContentLoaded",()=>{
    if(token){
    //   window.location.href="../html/expense.html"
    }
      
  })