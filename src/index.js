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

        window.location.href = "./saudeCliente.html"
    }catch(error){
        console.log(error)
    }
    
}

/** 
const saude = async() =>{
    const SaudeInfo ={
        tipodeSangue : document.getElementById("tp-sangue").value,
        doencas : document.getElementById("doencas").value,
        alergias : document.getElementById("alergias").value
    }
}


const saveSaude = async() =>{
    const info = await saude()

    try {   

    } catch (error) {
        console.log(error);
    }

} */


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


}


const identifyRole = async(doc) =>{
    if(doc.role == "Administrador"){
        console.log("Es Administrador")
        //Funções adicionais administrador

    
    }else if(doc.role == "Cliente"){
        console.log("És Cliente")
        //Funções adicionais cliente
    
    }
} 

const viewImage = async(data) =>{
    console.log(data)

    getDownloadURL(ref(storage, "newUserPhotos/" + data))
        .then((url) =>{
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
        sexualidade: document.getElementById("sexualidade").value
    }

    return data
}

const editInfo = async() =>{
    const info = await dataEditUser()

    try {
        await updateDoc(doc(db,"newUsers", localStorage.getItem("uId")), info)
        console.log("Sucesso")
    } catch (error) {
        console.log(error)
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

            const info = await getUserById()
            dataCurrentUser(info)
            identifyRole(info)

            document.getElementById("save-information").addEventListener("click", editInfo)
        }else{
            if(window.location.pathname == "/saudeCliente.html" ){
                document.getElementById("salvar-saude").addEventListener("click", saveSaude)
            }
        }
    }
}

