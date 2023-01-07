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



import{addPercursosToList, listPercursos} from "./listPercursos.js"

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



const registerClient = async() =>{


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
 

const uploadImage = async() =>{



    const file = document.getElementById("photo").files[0]
    const storageRef = ref(storage, "newUserPhotos/"+ localStorage.getItem("uId") + file.name )

    // Create file metadata including the content type
    /** @type {any} */

    const metadata = {
        contentType: 'image/jpeg, image/png, image/jpg',
    };

    uploadBytes(storageRef, file, metadata).then((snapshot) =>{
        console.log("Upload Image" + snapshot)
        localStorage.setItem("photoURL", localStorage.getItem("uId") + file.name )
    })
}


const newUser = async () =>{
    const ClientInfo = {
        uId : localStorage.getItem("uId"),
        FirstName : document.getElementById("firstname-register").value,
        LastName : document.getElementById("lastname-register").value,
        dataNascimento : document.getElementById("datanasc-register").value,
        numeroTelemovel : document.getElementById("phone-register").value,
        sexualidade : document.getElementById("sexualidade").value,
        photoURL : localStorage.getItem("photoURL"),
        role : "Cliente"
    }
    return ClientInfo
}



const saveCliente = async() =>{
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




const saveSaude = async() =>{
    const SaudeInfo ={
        tipodeSangue : document.getElementById("tp-sangue").value,
        doencas : document.getElementById("doencas").value,
        alergias : document.getElementById("alergias").value
    }
    
    try {
       setDoc(doc(collection(db, "newUsers/"+ localStorage.getItem("uId")+"/Saude")), SaudeInfo)
       console.log("Sucesso!")
    } catch (error) {
        console.log(error)
    }

} 


const getUserSaude = async() =>{
    try{
        const docSnap = await getDocs(doc(db, "newUsers", localStorage.getItem("uId"),"/Saude"))
        console.log(docSnap.data())
        return docSnap.data()
    }catch(error){
        console.log(error)
    }
}

const dataSaudeUser = async(doc) =>{
    document.getElementById("alergias").value = doc.alergias
    document.getElementById("doencas").value = doc.doencas
    document.getElementById("tp-sangue").value = doc.tipodeSangue
}


const getUserById = async() =>{
    try {
        const docSnap = await getDoc(doc(db, "newUsers", localStorage.getItem("uId")))
        console.log(docSnap.data())
        return docSnap.data()
        
    } catch (error) {
        console.log(error)
    }
}




const dataCurrentUser = async(doc) =>{
    document.getElementById("firstname-profile").value = doc.FirstName
    document.getElementById("lastname-profile").value = doc.LastName
    document.getElementById("datanasc-profile").value = doc.dataNascimento
    document.getElementById("phone-profile").value = doc.numeroTelemovel
    document.getElementById("sexualidade").value = doc.sexualidade
    viewImage(doc.photoURL)


    localStorage.setItem("role", doc.role)


}

 

const viewImage = async(data) =>{
    getDownloadURL(ref(storage, "newUserPhotos/" + data))
        .then((url) =>{
            console.log("Foto carregada com sucesso")
            document.getElementById("imagem-perfil").setAttribute('src', url)
        })
        .catch((error) =>{
            console.log(error)
        })
}

const dataEditUser = async () =>{
    const data = {
        FirstName:  document.getElementById("firstname-profile").value,
        LastName :  document.getElementById("lastname-profile").value,
        dataNascimento: document.getElementById("datanasc-profile").value,
        numeroTelemovel:  document.getElementById("phone-profile").value,
        sexualidade: document.getElementById("sexualidade").value,
        photoURL: localStorage.getItem("urlPhoto")
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


const createPercurso = async() =>{
  // const info = {
  //     id : Math.random().toString(16).slice(2),
  //     Nome: document.getElementById("nome-percurso").value,
  //     Descricao: document.getElementById("descricao-percurso").value,
  //     DataCriacao: currentDay,
  //     DataInicio : document.getElementById("data-percurso").value,
  //     HoraInicio : document.getElementById("hora-percurso").value,
  //     Criador: localStorage.getItem("uId")
  // }


  // try {
  //     await setDoc(doc(collection(db, "newPercursos"), info.id), info)
  //     console.log("Sucesso")
  //     alert("Criado com sucesso!")
  //     window.location.href = "percursos.html"
  // } catch (error) {
  //     console.log(error)
  // }

}

const getPercursos = async() =>{
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



if(window.location.pathname == "/index.html"){
    
    document.getElementById("btn-entrar-login").addEventListener("click", login)
    
}else{
    if(window.location.pathname=="/register.html"){
        document.getElementById("save-info-cliente").addEventListener("click", registerClient)
    console.log(localStorage.getItem("uId"))

    }else{
        if(window.location.pathname == "/profileUser.html"){
        console.log(localStorage.getItem("uId"))

            
            document.getElementById("logout-btn").addEventListener("click", logout)

            const info = await getUserById()
            dataCurrentUser(info)



            const saude = await getUserSaude()
            dataSaudeUser(saude)
            document.getElementById("save-information").addEventListener("click", editInfo)

            document.getElementById("salvar-saude").addEventListener("click", saveSaude)
        }else{
            if(window.location.pathname == "/saudeCliente.html" ){
               
            }else{
                if(window.location.pathname =="/criarPercursos.html"){
                    document.getElementById("save_percursos").addEventListener("click", createPercurso)
                }else{
                    if(window.location.pathname == "/percursos.html"){
                        getPercursos()
                    }
                }
            }
        }
    }
}

