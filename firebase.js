// ============================================================
// AMESTIA — CONFIGURAÇÃO DO FIREBASE
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================================
// CONFIGURAÇÃO DO PROJETO
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyCC2hfTgTHbbQLUp0HaxxzUhfy6BCHh21o",
    authDomain: "amestia.firebaseapp.com",
    databaseURL: "https://amestia-default-rtdb.firebaseio.com",
    projectId: "amestia",
    storageBucket: "amestia.firebasestorage.app",
    messagingSenderId: "201084736589",
    appId: "1:201084736589:web:a3001e640ff75397543804",
    measurementId: "G-LD0DPFDWDV"
};


// ============================================================
// INICIALIZAÇÃO
// ============================================================

const app = initializeApp(firebaseConfig);


// ============================================================
// AUTENTICAÇÃO
// ============================================================

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();


// ============================================================
// FIRESTORE
// ============================================================

const db = getFirestore(app);


// ============================================================
// EXPORTAÇÕES
// ============================================================

export {
    app,
    auth,
    googleProvider,
    db
};
// ============================================================
// DISPONIBILIZAR PARA OS OUTROS ARQUIVOS DO AMESTIA
// ============================================================

window.AmestiaFirebase = {
    app,
    auth,
    googleProvider,
    db
};