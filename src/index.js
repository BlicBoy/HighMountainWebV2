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
//import{ listClientes2 } from "./listClients.js"



const auth = getAuth(firebaseConfig)
const db = getFirestore(firebaseConfig)
const storage = getStorage(firebaseConfig)
let today = new Date()
let currentDay = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
let uidUser = "noID"
var log = false
let linkPhoto = "noPhoto"


//vai buscar todos os dados do utilizador que fez login
//sabe qual é o utilizador pelo uidUser que ganha valor dentro da função login
const dataUserLogin = async() =>{
    try {
      const docSnap = await getDoc(doc(db, "newUsers", uidUser))
      console.log(docSnap.data())
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
        uidUser = user.uid
        log = true

    }).catch((error) =>{
        console.log(error.code+ " "+ error.message)
    })

    //aqui recebe um boolean chamado log que é declarado como variavel global e dentro do login ganha valor de true se o login for feito com sucesso
    if(log){
      const user = await dataUserLogin()
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
    const storageRef = ref(storage, "newUserPhotos/"+ uid + files.name)

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
          uidUser = user.uid //guarda o id do utilizador
          log = true //fica com o login feito
          
          
          uploadPhotoRegister() // chama a função para guardar a foto
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

  //recolhe tudo dentro desta constante
  const ClienteInfo = {
    uId : uidUser,
    FirstName : document.getElementById("firstname-register").value,
    LastName : document.getElementById("lastname-register").value,
    dataNascimento : document.getElementById("datanasc-register").value,
    numeroTelemovel : document.getElementById("phone-register").value,
    sexualidade : document.getElementById("sexualidade").value,
    role : "Cliente",
    tipodeSangue : document.getElementById("tp-sangue-register").value,
    doencas : document.getElementById("doencas-register").value,
    alergias : document.getElementById("alergias-register").value,
    photoURL : linkPhoto.toString()
  }

  console.log(ClienteInfo)
  //envia os dados para o firebase
  try{
    await setDoc(doc(collection(db, "newUsers"), uidUser), ClienteInfo)

    getClientes()
    console.log("Sucesso!")
    window.location.href = "profileCliente.html" //redirecionar para a pagina do cliente

  }catch(error){
    console.log(error)
  }
}


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


//saber qual é a pagina
switch(window.location.pathname) {
  case "/login.html":
    document.getElementById("btn-entrar-login").addEventListener("click", login)  
    break;

  case "/register.html":
    document.getElementById("save-info-cliente").addEventListener("click", registerClient)
    break;

  case "/listClients.html":
    getClientes()
    break;
 
  default:
    break;
}