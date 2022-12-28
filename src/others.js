const SendRegister = async() =>{
    console.log("New user!")
    window.location.href = "./register.html"
}

const verifySession = async() =>{
    if(localStorage.getItem("uId") == null){
        window.location.href = "./index.html"
    }
}


if(window.location.pathname == "/index.html"){
    document.getElementById("register").addEventListener("click", SendRegister)
}else{
    if(window.location.pathname == "/register.html"){
        
    }else{
        if(window.location.pathname == "/profileUser.html"){
            verifySession()
        }
    }
}
