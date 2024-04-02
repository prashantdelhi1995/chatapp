let token=localStorage.getItem("token")
document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    axios.post('http://localhost:3000/user/signup', {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    })
    .then(function(response) {
        console.log('Signup successful:', response.data);
       
        document.getElementById('email').value = "";
        document.getElementById('password').value = "";
        document.getElementById('name').value = "";
        alert('Signup successful!');
        
        // Redirect or do something else after successful signup
    })
    .catch(function(error) {
        console.error('Signup failed:', error.response.data);
        alert('Signup failed: ' + error.response.data);
    });
});
window.addEventListener("DOMContentLoaded",()=>{
  
      
  })