
//imports firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";

const firebaseConfig = initializeApp({

    apiKey: "AIzaSyBc0yBxPb6Pbs40M-t1gWJgDrC6OIsya9o",
    authDomain: "app-alpinismo.firebaseapp.com",
    databaseURL: "https://app-alpinismo-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "app-alpinismo",
    storageBucket: "app-alpinismo.appspot.com",
    messagingSenderId: "835740902039",
    appId: "1:835740902039:web:0203df344e27c035897fd2",
    measurementId: "G-0NR4TRNWLG"
});

import {
    getFirestore,
    doc, setDoc,addDoc ,
    getDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    query,
    orderBy, limit,
    Timestamp, collection
  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
  import {
    getAuth, updateProfile,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged, signOut
  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";


import{ getStorage,  ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";


//imports internos
import{ listClientes2 } from "./listClients.js"

import{listPercursos2, listPercursosClientes} from "./listPercursos.js"


const auth = getAuth(firebaseConfig)
const db = getFirestore(firebaseConfig)
const storage = getStorage(firebaseConfig)
let today = new Date()
let currentDay = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();


//vai buscar todos os dados do utilizador que fez login
//sabe qual é o utilizador pelo uidUser que ganha valor dentro da função login
const dataUserLogin = async() =>{
    try {
      const docSnap = await getDoc(doc(db, "newUsers", localStorage.getItem("uidUser")))
      return docSnap.data()
      
  } catch (error) {
      console.log(error)
  }
}

//faz o login
const login = async() => {
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) =>{

        const user = userCredential.user
        localStorage.setItem("uidUser", user.uid)
        localStorage.setItem("email", user.email)
        localStorage.setItem("log", true)

    }).catch((error) =>{
        console.log(error.code+ " "+ error.message)
    })

    //aqui recebe um boolean chamado log que é declarado como variavel global e dentro do login ganha valor de true se o login for feito com sucesso
    if(localStorage.getItem("log")){
      const user = await dataUserLogin()
      localStorage.setItem("Role", user.role)
      if(user.role == "Administrador"){
        window.location.href = "profileAdmin.html" //redireciona para o perfil do Administrador
      }else if(user.role == "Cliente"){
        window.location.href = "profileCliente.html" //redireciona para o perfil do Cliente
      }
    }
}


//vai dar upload a foto do register.html
const uploadPhotoRegister = async() =>{
    const files = document.getElementById("photo-register").files[0]
    const storageRef = ref(storage, "newUserPhotos/"+ localStorage.getItem("uidUser") + files.name)

     /** @type {any} */
    const metadata = {
      contentType: 'image/jpeg, image/png, image/jpg',
  }

  uploadBytes(storageRef, files, metadata).then((snapshot) =>{
    console.log("Upload Image" + snapshot)
    linkPhoto = uidUser + files.name
  })
}


//registro de um novo cliente
const registerClient = async() => {
  let email = document.getElementById("email-register").value
  let password = document.getElementById("password-register").value

  createUserWithEmailAndPassword(auth, email, password) //primerio recebe o email e a password
      .then((userCredential) => {
          const user = userCredential.user //ter as credenciais do utilizador email /  Auth.id
          localStorage.setItem("uidUser", user.uid) //guarda o id do utilizador
          localStorage.setItem("log", true) //fica com o login feito
          
          
      
          datanewUser() //guarda tudo depois
      }).catch((error) =>{
          console.log(error.code+ " " +error.message)
      })

      if(log){
        window.location.href="profileCliente.html" //redireciona para o perfil do Cliente
      }

}


//salva os dados no registro de um novo utilizador
const datanewUser = async() =>{

  uploadPhotoRegister() // chama a função para guardar a foto
  //recolhe tudo dentro desta constante
  const ClienteInfo = {
    uId : localStorage.getItem("uidUser"),
    FirstName : document.getElementById("firstname-register").value,
    LastName : document.getElementById("lastname-register").value,
    dataNascimento : document.getElementById("datanasc-register").value,
    numeroTelemovel : document.getElementById("phone-register").value,
    sexualidade : document.getElementById("sexualidade").value,
    role : "Cliente",
    tipodeSangue : document.getElementById("tp-sangue-register").value,
    doencas : document.getElementById("doencas-register").value,
    alergias : document.getElementById("alergias-register").value,
    photoURL : localStorage.getItem("uidUser") + document.getElementById("photo-register").files[0].name
  }


  //Guarda clientes na base de dados

  try{
    await setDoc(doc(collection(db, "newUsers"), uidUser), ClienteInfo)
    getClientes()
    console.log("Sucesso!")
    window.location.href = "profileCliente.html" //redirecionar para a pagina do cliente

  }catch(error){
    console.log(error)
  }
}

//ver imagem
const viewImage = async(data,local) =>{
  getDownloadURL(ref(storage, "newUserPhotos/"+ data))
    .then((url)=>{
      document.getElementById(local).setAttribute('src', url)
    })
    .catch((error) =>{
      console.log(error)
    })
}

//da export da função de ver a imagem
export{ viewImage }


//mostra os clientes
const getClientes = async () =>{
    console.log("listar")
    const list = document.querySelector("#listClient")
    list.innerHTML = ""
    console.log(list)
    const q = await query(collection(db, "newUsers"))
    const querySnapshot = await getDocs(q)
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
        listClientes2(doc)
  })
}


//Preenche os campos do utilizador que deu login
const completeLoginUser = async()=>{
    var data = await dataUserLogin()
    viewImage(data.photoURL, "imagem-perfil")
    document.getElementById("firstname-profile").value = data.FirstName
    document.getElementById("lastname-profile").value = data.LastName
    document.getElementById("datanasc-profile").value = data.dataNascimento
    document.getElementById("phone-profile").value = data.numeroTelemovel
    document.getElementById("sexualidade").value = data.sexualidade
    document.getElementById("doencas").value = data.doencas
    document.getElementById("alergias").value = data.alergias
    document.getElementById("tp-sangue").value = data.tipodeSangue
}

//dá upload a qualquer foto basta passar o id pelo argumento
const uploadAllPhotos = async (id, local) =>{

  const files = document.getElementById(local).files[0]
  const storageRef = ref(storage, "newUserPhotos/"+ id + files.name)

   /** @type {any} */
  const metadata = {
    contentType: 'image/jpeg, image/png, image/jpg',
}

  uploadBytes(storageRef, files, metadata).then((snapshot) =>{
    console.log("Upload Image" + snapshot)
  })
}


//update photo
const updatePhoto = async()=>{
    try{
      if(document.getElementById("photo").files[0] != undefined){
        const data = {
          photoURL: localStorage.getItem("uidUser") + document.getElementById("photo").files[0].name
        }
        uploadAllPhotos(localStorage.getItem("uidUser"),"photo")
        await updateDoc(doc(db,"newUsers", localStorage.getItem("uidUser")), data)
        viewImage(data.photoURL, "imagem-perfil")
        document.getElementById("photo").value = ""
        alert('Imagem atualizada com sucesso!')
      }else{
        alert('Nenhuma imagem selecionada!')
      }

    }catch(error){
      console.log(error.code + " " +error.message)
    }
}

//update detalhes da conta
const updateDetailsAccount = async()=>{

  try{
      const info = {
        FirstName:  document.getElementById("firstname-profile").value,
        LastName :  document.getElementById("lastname-profile").value,
        dataNascimento: document.getElementById("datanasc-profile").value,
        numeroTelemovel:  document.getElementById("phone-profile").value,
        sexualidade: document.getElementById("sexualidade").value
      }
      await updateDoc(doc(db,"newUsers", localStorage.getItem("uidUser")), info)
      alert('Detalhes da conta alterados com sucesso!')
  }catch(error){
    console.log(error.code + " " +error.message)
  }

}

//update a parte da saude
const updateSaudeAccount = async() =>{
  try{
    const info = {
      doencas : document.getElementById("doencas").value,
      alergias : document.getElementById("alergias").value,
      tipodeSangue : document.getElementById("tp-sangue").value
    }

    await updateDoc(doc(db, "newUsers", localStorage.getItem("uidUser")), info)
    alert('Dados de Saúde alterados com sucesso!')

  }catch(error){
      console.log(error.code +" "+error.message)
  }
}



//listar percursos
const getPercursos = async () =>{
  console.log("listar")
  const list = document.querySelector("#list")
  list.innerHTML = ""
  console.log(list)
  const q = await query(collection(db, "newPercursos"))
  const querySnapshot = await getDocs(q)
  console.log(querySnapshot);
  querySnapshot.forEach((doc) => {
      console.log(doc.data());
      listPercursos2(doc)
})
}

//listar percursos cliente
const getPercursosClientes = async()=>{
  console.log("listar")
  const list = document.querySelector("#list-percursos-clientes")
  list.innerHTML = ""
  console.log(list)
  const q = await query(collection(db, "newPercursos"))
  const querySnapshot = await getDocs(q)
  console.log(querySnapshot);
  querySnapshot.forEach((doc) => {
    //console.log(doc.data());
    listPercursosClientes(doc)
})
}
//inserir percursos
const insertActivity = async()=>{
  
  try {
    if(document.getElementById("photoPercursos").files[0] != undefined){
      const users = await dataUserLogin()
      var id_generate = Math.random().toString(16).slice(2)
      uploadAllPhotos(id_generate,"photoPercursos")
      
      const info = {
        id : id_generate,
        Nome: document.getElementById("nomepercurso").value,
        Descricao: document.getElementById("descricaopercurso").value,
        DataCriacao: currentDay,
        DataInicio : document.getElementById("dataInicio").value,
        HoraInicio : document.getElementById("horaInicio").value,
        NomeCriador : users.FirstName,
        photoCriador : users.photoURL,
        photoPercurso : id_generate + document.getElementById("photoPercursos").files[0].name,
        IdCriador : localStorage.getItem("uidUser")
      }

      await setDoc(doc(collection(db,"newPercursos"), id_generate), info)
      getPercursos()
      alert('Percurso Criado com sucesso!')

      
    }else{
      alert('Existem campos em falta')
    }
      

  } catch (error) {
    console.log(error.code +" "+error.message)
  }
  
  


}


//enviar administador para a listagem dos clientes
const sendListCliente = async() =>{
  window.location.href = "/listClients.html"
}

//entrar no percurso
const participateActivity = async() =>{
  const list = document.querySelector("#list-percursos-clientes")
    list.addEventListener('click', async function(event){
        if(document.getElementById("participar")){
          var data = await dataUserLogin()
          
          const info = {
            uIdPercurso : event.target.getAttribute('data-id'),
            nomePercurso: event.target.getAttribute('data-name'),
            uIdParticipante:  localStorage.getItem("uidUser"),
            nomeParticipante: data.FirstName,
            email : localStorage.getItem("email")
          }

          var randomid = Math.random().toString(16).slice(2)

          try {
          
            await setDoc(doc(collection(db, "Participantes"), randomid), info)
            console.log("Sucesso")
            alert('Entrou na Atividade')

          } catch (error) {
            console.log(error.code + " " + error.name)
          }


        }
    })

}

//logout
const logout = async() =>{
    auth.signOut().then((on) =>{
      console.log("Logout")
      localStorage.clear()
      window.location.href = "/login.html"

    }).catch((error)=>{
      console.log(error)
    })
}


//saber qual é a pagina
switch(window.location.pathname) {
  case "/login.html":
    document.getElementById("btn-entrar-login").addEventListener("click", login)  
    break;

  case "/register.html":
    document.getElementById("save-info-cliente").addEventListener("click", registerClient)
    break;

  case "/profileAdmin.html":
    document.getElementById("save-information-photo").addEventListener("click", updatePhoto)
    document.getElementById("logout-btn").addEventListener("click", logout)
    document.getElementById("save-information").addEventListener("click", updateDetailsAccount)
    document.getElementById("salvar-saude").addEventListener("click", updateSaudeAccount)
    completeLoginUser()
    getPercursos()
    document.getElementById("save-percurso").addEventListener("click", insertActivity)
    document.getElementById("administrador-clientes").addEventListener("click", sendListCliente)
    break;

    case "/profileCliente.html":
      document.getElementById("save-information-photo").addEventListener("click", updatePhoto)
      document.getElementById("logout-btn").addEventListener("click", logout)
      document.getElementById("save-information").addEventListener("click", updateDetailsAccount)
      document.getElementById("salvar-saude").addEventListener("click", updateSaudeAccount)
      completeLoginUser()
      getPercursosClientes()
      participateActivity()
      break;

  case "/listClients.html":
     getClientes()
    break;

 
  default:
    break;
}