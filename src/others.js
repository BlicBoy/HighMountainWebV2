const SendRegister = () =>{
    console.log("New user!")
    window.location.href = "./register.html"
}

const SendLogin = async() =>{
    console.log("Login Open")
    window.location.href = "./index.html"
}

const SendPerfilUser = async() =>{
    console.log("Perfil User")
    window.location.href = "./profileUser.html"
}


const verifySession = async() =>{
    if(localStorage.getItem("uId") == null){
        console.log("Sem sessão")
        SendLogin()
    }
}




if(window.location.pathname == "/index.html"){
    document.getElementById("register").addEventListener("click", SendRegister)
}else{
    if(window.location.pathname == "/register.html"){
        document.getElementById("return-login").addEventListener("click", SendLogin)
    }else{
        if(window.location.pathname == "/profileUser.html"){
            verifySession()
        }else{
            if(window.location.pathname == "/saudeCliente.html"){
                verifySession()

                document.getElementById("profilUser").addEventListener("click", SendPerfilUser)
            }

        }
    }
}
