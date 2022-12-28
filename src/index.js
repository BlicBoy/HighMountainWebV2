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
    doc, setDoc,
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

const auth = getAuth(firebaseConfig)
const db = getFirestore(firebaseConfig)
const storage = getStorage(firebaseConfig)



const login = async() => {

    console.log("login!")

    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) =>{
        const user = userCredential.user
        localStorage.setItem("uId", user.uid)
        
        window.location.href="./profileUser.html"
    }).catch((error) =>{
        console.log(error.code+ " "+ error.message)
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
        photoURL : localStorage.getItem("urlPhoto"),
        role : "Cliente"
    }
    return ClientInfo
}


const registerClient = async() =>{


    let email = document.getElementById("email-register").value
    let password = document.getElementById("password-register").value

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User Criado")
            const user = userCredential.user;
            localStorage.setItem("uId", user.uid)
            console.log(localStorage.getItem("uId")) 

            uploadImage()
            saveCliente()

        }).catch((error) =>{
            console.log(error.code + " " + error.message)
        })

}
 

const uploadImage = async() =>{

    const file = document.getElementById("photo").files[0]
    const storageRef = ref(storage, "newUserPhotos/"+ localStorage.getItem("uId") + file.name )

    // Create file metadata including the content type
    /** @type {any} */

    const metadata = {
        contentType: 'image/jpeg',
    };

    uploadBytes(storageRef, file, metadata).then((snapshot) =>{
        console.log("Upload Image")
        localStorage.setItem("urlPhoto", localStorage.getItem("uId") + file.name )
    })

    getDownloadURL(ref(storage, "newUserPhotos/" + localStorage.getItem("uId") + file.name  ))
        .then((url) =>{
            console.log(url)
        })
        .catch((error) =>{
            console.log(error.code+" "+error.message);
        })
    
}


const saveCliente = async() =>{
    const info  = await newUser()

    try{
        await setDoc(doc(collection(db, "newUsers"), localStorage.getItem("uId")), info)
        console.log("dados inseridos")

        window.location.href = "./profileUser.html"
    }catch(error){
        console.log(error)
    }
    
}

const loginStatus = async() =>{
    if(localStorage.getItem("uId") != null){
        window.location.href = "./profileUser.html"
        console.log("Logged")
    }else{
        window.location.href = "./index.html"
    }
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
    }else{
        if(window.location.pathname == "/profileUser.html"){
            
            document.getElementById("logout-btn").addEventListener("click", logout)
        }
    }
}

