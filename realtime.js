import { getState } from "./tools.js";

const firebaseConfig = {
  apiKey: "AIzaSyA3Eo8CTL0CqZ-_qrVJmloL2YpYGyO2Q_Q",
  authDomain: "mathboardpro-3f07b.firebaseapp.com",
  databaseURL: "https://mathboardpro-3f07b-default-rtdb.firebaseio.com",
  projectId: "mathboardpro-3f07b",
  storageBucket: "mathboardpro-3f07b.firebasestorage.app",
  messagingSenderId: "318885521756",
  appId: "1:318885521756:web:9995c0ddccea4b6080f999",
  measurementId: "G-R7K6V2LMEL"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const board = db.ref("mathboardpro");

export function enviarTrazo(trazo){
    board.push(trazo);
}

export function escucharTrazos(callback){
    board.on("child_added",snap=>{
        callback(snap.val());
    });
}