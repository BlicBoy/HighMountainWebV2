let uid = localStorage.getItem("uId");
let role = localStorage.getItem("role")


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

const SendSaude = async() =>{
    console.log("Saude")
    window.location.href ="./saudeCliente.html"
}

const verifySession = async() =>{
    if(uid == null){
        console.log("Sem sessão")
        SendLogin()
    }
}

const verifyAdmin = async() =>{
    if(role == "Administrador"){
        return true
    }else{
        return false
    }
}


const sendListClientesAdmin = async() =>{
    window.location.href ="./Admin/listClientes.html"
}

if(window.location.pathname == "/index.html"){
    document.getElementById("register").addEventListener("click", SendRegister)
}else{
    if(window.location.pathname == "/register.html"){
        document.getElementById("return-login").addEventListener("click", SendLogin)
    }else{
        if(window.location.pathname == "/profileUser.html"){
            verifySession()
            const admin = verifyAdmin()

            if(admin){
                document.getElementById("administrador-clientes").style = "display: block"
            }
            document.getElementById("administrador-clientes").addEventListener("click", sendListClientesAdmin)
        }else{
            if(window.location.pathname == "/saudeCliente.html"){
                verifySession()
                document.getElementById("profilUser").addEventListener("click", SendPerfilUser)
            }
        }
    }
}
