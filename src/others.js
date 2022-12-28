const SendRegister = async() =>{
    console.log("New user!")
    window.location.href = "./register.html"
}



if(window.location.pathname == "/index.html"){
    document.getElementById("register").addEventListener("click", SendRegister)
}else{
    if(window.location.pathname == "/register.html"){
        
    }
}
