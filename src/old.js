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
import{ listPercursos2} from "./listPercursos.js"

const auth = getAuth(firebaseConfig)
const db = getFirestore(firebaseConfig)
const storage = getStorage(firebaseConfig)
let today = new Date()
let currentDay = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();


const login = async() => {

    console.log("login!")

    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) =>{

        const user = userCredential.user
        localStorage.setItem('uId', user.uid)
        window.location.href="profileUser.html"

    }).catch((error) =>{
        console.log(error.code+ " "+ error.message)
    })
}


const registerClient = async() => {


    let email = document.getElementById("email-register").value
    let password = document.getElementById("password-register").value

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User Criado - Auth")
            const user = userCredential.user
            localStorage.setItem("uId", user.uid)

            uploadImage()
            saveCliente()

        })

}
 

const uploadImage = async() => {

    const file = document.getElementById("photo").files[0]
    const storageRef = ref(storage, "newUserPhotos/"+ localStorage.getItem("uId") + file.name )

   
    /** @type {any} */

    const metadata = {
        contentType: 'image/jpeg, image/png, image/jpg',
    };

    uploadBytes(storageRef, file, metadata).then((snapshot) =>{
        console.log("Upload Image" + snapshot)
        localStorage.setItem("photoURL", localStorage.getItem("uId") + file.name )
    })
}


const newUser = async () => {
    const ClientInfo = {
        uId : localStorage.getItem("uId"),
        photoURL : localStorage.getItem("photoURL"),
        FirstName : document.getElementById("firstname-register").value,
        LastName : document.getElementById("lastname-register").value,
        dataNascimento : document.getElementById("datanasc-register").value,
        numeroTelemovel : document.getElementById("phone-register").value,
        sexualidade : document.getElementById("sexualidade").value,
        role : "Cliente",
        alergias : document.getElementById("alergias").value,
        doencas : document.getElementById("doencas").value,
        tipodeSangue : document.getElementById("tp-sangue").value
    }

    return ClientInfo
}


const saveCliente = async() => {
    const info  = await newUser()

    try{
        await setDoc(doc(collection(db, "newUsers"), localStorage.getItem("uId")), info)
        console.log("dados inseridos")
        console.log(localStorage.getItem("photoURL"))

       // window.location.href = "./saudeCliente.html"
    }catch(error){
        console.log(error)
    }
    
}


const getUserById = async() => {
    try {
        const docSnap = await getDoc(doc(db, "newUsers", localStorage.getItem("uId")))
        console.log(docSnap.data())
        return docSnap.data()
        
    } catch (error) {
        console.log(error)
    }
}


const dataCurrentUser = async(doc) =>{
    viewImage(doc.photoURL,"imagem-perfil")
    document.getElementById("firstname-profile").value = doc.FirstName
    document.getElementById("lastname-profile").value = doc.LastName
    document.getElementById("datanasc-profile").value = doc.dataNascimento
    document.getElementById("phone-profile").value = doc.numeroTelemovel
    document.getElementById("sexualidade").value = doc.sexualidade
    document.getElementById("doencas").value = doc.doencas
    document.getElementById("alergias").value = doc.alergias
    document.getElementById("tp-sangue").value = doc.tipodeSangue


    localStorage.setItem("role", doc.role)
}
 

const viewImage = async(data,local) =>{
    getDownloadURL(ref(storage, "newUserPhotos/" + data))
        .then((url) =>{
            console.log("Foto carregada com sucesso")
            document.getElementById(local).setAttribute('src', url)
        })
        .catch((error) =>{
            console.log(error)
        })
}

export { viewImage }


const dataEditUser = async () =>{
    const data = {
        photoURL: localStorage.getItem("urlPhoto"),
        FirstName:  document.getElementById("firstname-profile").value,
        LastName :  document.getElementById("lastname-profile").value,
        dataNascimento: document.getElementById("datanasc-profile").value,
        numeroTelemovel:  document.getElementById("phone-profile").value,
        sexualidade: document.getElementById("sexualidade").value
    }

    return data
}


const editInfo = async() =>{
    const info = await dataEditUser()

    try {
        uploadImage()
        await updateDoc(doc(db,"newUsers", localStorage.getItem("uId")), info)  
        console.log("Sucesso")
        viewImage(info.photoURL)
    } catch (error) {
        console.log(error)
    }
}


const uploadImagePercurso = async() =>{

    const file = document.getElementById("photoPercursos").files[0]
    const storageRef = ref(storage, "newUserPhotos/"+ localStorage.getItem("uIdPercursos") + file.name )
    console.log(storageRef)

    /** @type {any} */

    const metadata = {
        contentType: 'image/jpeg, image/png, image/jpg',
    };

    uploadBytes(storageRef, file, metadata).then((snapshot) =>{
        console.log("Upload Image" + snapshot)
        localStorage.setItem("photoPercursos", localStorage.getItem("uIdPercursos") + file.name )
    })

    console.log(localStorage.getItem("photoPercursos"))
}


const createPercurso = async() =>{

    const users = await getUserById()

    localStorage.setItem("uIdPercursos", Math.random().toString(16).slice(2))

    await uploadImagePercurso()

   const info = {
        id : localStorage.getItem("uIdPercursos"),
        Nome: document.getElementById("nomepercurso").value,
        Descricao: document.getElementById("descricaopercurso").value,
        DataCriacao: currentDay,
        DataInicio : document.getElementById("dataInicio").value,
        HoraInicio : document.getElementById("horaInicio").value,
        NomeCriador : users.FirstName,
        photoCriador : users.photoURL,
        photoPercurso : localStorage.getItem("photoPercursos"),
        IdCriador : localStorage.getItem("uId")
    }
        try {
            await setDoc(doc(collection(db, "newPercursos"), info.id), info)
            
            getPercursos();
            console.log("Sucesso")
            alert("Criado com sucesso!")
        } catch (error) {
            console.log(error)
        }
}


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


const logout = async() =>{
    auth.signOut().then((on)=>{
        console.log("Sair")
        localStorage.clear()
        window.location.href= "./index.html"
    }).catch((error)=>{
        console.log(error)
    })
}

const verifyAdmin = async() =>{
    if(role == "Administrador"){
        return true
    }else{
        return false
    }
}


if(window.location.pathname == "/login.html"){
    
    document.getElementById("btn-entrar-login").addEventListener("click", login)
    
}else{
    if(window.location.pathname=="/register.html"){
        document.getElementById("save-info-cliente").addEventListener("click", registerClient)
    console.log(localStorage.getItem("uId"))

    }else{
        if(window.location.pathname == "/profileUser.html"){
        console.log(localStorage.getItem("uId"))

            document.getElementById("save-percurso").addEventListener("click", createPercurso)
            
            document.getElementById("logout-btn").addEventListener("click", logout)

            const info = await getUserById()
            dataCurrentUser(info)

            document.getElementById("save-information").addEventListener("click", editInfo)

            document.getElementById("salvar-saude"),addEventListener("click",editInfo )

            await getPercursos()

        }else{
            if(window.location.pathname == "/saudeCliente.html" ){
               
            }else{
                if(window.location.pathname == "/criarPercursos.html"){
                   
                }else{
                    if(window.location.pathname == "/percursos.html"){
                       
                    }
                }
            }
        }
    }
}

