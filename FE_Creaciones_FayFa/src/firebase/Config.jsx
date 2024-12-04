// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import {v4} from 'uuid'
const firebaseConfig = {
  apiKey: "AIzaSyCN46GMyrAIoQxYWChRA8aIirlBeuRAfxI",
  authDomain: "creaciones-fayfa.firebaseapp.com",
  projectId: "creaciones-fayfa",
  storageBucket: "creaciones-fayfa.firebasestorage.app",
  messagingSenderId: "200451211681",
  appId: "1:200451211681:web:b43385b1d581356d89cbe0",
  measurementId: "G-ZKRT41Z3QZ"
};

const app = initializeApp(firebaseConfig);
export const storage =getStorage(app)

export async function UploadFile(file) {
const storageRef=ref(storage, v4())
 await uploadBytes(storageRef, file)

 const url = await getDownloadURL(storageRef)//me retorna una url
    return url
}