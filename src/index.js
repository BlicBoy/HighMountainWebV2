// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBc0yBxPb6Pbs40M-t1gWJgDrC6OIsya9o",
  authDomain: "app-alpinismo.firebaseapp.com",
  databaseURL: "https://app-alpinismo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "app-alpinismo",
  storageBucket: "app-alpinismo.appspot.com",
  messagingSenderId: "835740902039",
  appId: "1:835740902039:web:0203df344e27c035897fd2",
  measurementId: "G-0NR4TRNWLG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
//Initialize firestore
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);



