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
import{ listClientes2 } from "./listClients.js"



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
const uploadAllPhotos = async (local) =>{

  const files = document.getElementById(local).files[0]
  const storageRef = ref(storage, "newUserPhotos/"+ localStorage.getItem("uidUser") + files.name)

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
        uploadAllPhotos("photo")
        await updateDoc(doc(db,"newUsers", localStorage.getItem("uidUser")), data)
        viewImage(data.photoURL, "imagem-perfil")
        document.getElementById("photo").value = ""
      }else{
        alert('Nenhuma imagem selecionada!')
      }

    }catch(error){
      console.log(error.code + " " +error.message)
    }
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
    completeLoginUser()
    break;

  case "/listClients.html":
     getClientes()
    break;

 
  default:
    break;
}