const SendRegister = async() =>{
    console.log("New user!")
    window.location.href = "./register.html"
}


document.getElementById("register").addEventListener("click", SendRegister)