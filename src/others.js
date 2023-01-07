let uid = localStorage.getItem("uId");
let role = localStorage.getItem("role")


const SendRegister = async() =>{
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
    window.location.href = "./saudeCliente.html"
}

const SendPercursos = async() =>{
    console.log("Percursos")
    window.location.href = "./percursos.html"
}

const SendCriarPercursos = async() =>{
    console.log("Criar Percursos")
    window.location.href = "./criarPercursos.html"
}

const Participantes = async() =>{
    console.log("Participantes")
    window.location.href = "./Admin/"
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
    window.location.href ="./listClientes.html"
}

if(window.location.pathname == "index.html"){
    document.getElementById("register").addEventListener("click", SendRegister)
}else{
    if(window.location.pathname == "/register.html"){
   
    }else{
        if(window.location.pathname == "/profileUser.html"){
           // verifySession()
            const admin = verifyAdmin()

            if(admin){
                document.getElementById("administrador-clientes").style = "display: block"
            }
            document.getElementById("administrador-clientes").addEventListener("click", sendListClientesAdmin)
            document.getElementById("administrador-percursos").addEventListener("click", SendPercursos)
            document.getElementById("saude-information").addEventListener("click", SendSaude)
        }else{

            if(window.location.pathname == "/percursos.html"){
                console.log("AQUI")
                document.getElementById("criarPercurso").addEventListener("click", SendCriarPercursos)
            }   
            else{
                if(window.location.pathname == "/saudeCliente.html"){
                    verifySession()
                    document.getElementById("profilUser").addEventListener("click", SendPerfilUser)
                }
            }
        }
    }
}
