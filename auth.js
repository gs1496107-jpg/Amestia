// Substituímos a versão 12.16.0 pela 10.12.2 que é oficial e estável
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// Importa as funções de Autenticação na MESMA versão
import { 
    getAuth, 
    signInWithPopup, // <-- Correção 1: O "Redirect" saiu, entrou o "Popup" aqui
    GoogleAuthProvider, 
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// A sua configuração real do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCC2hfTgTHbbQLUp0HaxxzUhfy6BCHh21o",
    authDomain: "amestia.firebaseapp.com",
    projectId: "amestia",
    storageBucket: "amestia.firebasestorage.app",
    messagingSenderId: "201084736589",
    appId: "1:201084736589:web:a3001e640ff75397543804",
    measurementId: "G-LD0DPFDWDV"
};

// Inicializa o Firebase e o Analytics
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa a Autenticação
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Busca o elemento do menu onde o nome aparece
const profileLink = document.getElementById('nav-profile-link');

// Função para fazer login via Popup
async function loginComGoogle() {
    try {
        await signInWithPopup(auth, provider); // <-- Correção 2: Letra "u" minúscula
    } catch (error) {
        console.error("Erro no login:", error);
    }
}

// Função para deslogar
async function sair(evento) {
    evento.preventDefault();
    try {
        await signOut(auth);
        console.log("Usuário deslogado");
    } catch (error) {
        console.error("Erro ao deslogar:", error);
    }
}

// Busca os elementos das telas no HTML
const visaoDeslogado = document.getElementById('visao-deslogado');
const visaoLogado = document.getElementById('visao-logado');

// Monitora o estado da autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        // --- USUÁRIO LOGADO ---
        const primeiroNome = user.displayName.split(' ')[0];
        
        if (profileLink) {
            profileLink.innerHTML = `${primeiroNome} <img src="${user.photoURL}" alt="Foto" style="width: 20px; height: 20px; border-radius: 50%; vertical-align: middle; margin-left: 5px;">`;
            profileLink.onclick = sair; 
        }
        
        if (visaoDeslogado) visaoDeslogado.style.display = 'none';
        if (visaoLogado) visaoLogado.style.display = 'block';
        
    } else {
        // --- USUÁRIO DESLOGADO ---
        if (profileLink) {
            profileLink.innerHTML = `Conectar <i class="fas fa-google"></i>`;
            profileLink.onclick = (evento) => {
                evento.preventDefault();
                loginComGoogle();
            };
        }

        if (visaoDeslogado) visaoDeslogado.style.display = 'block';
        if (visaoLogado) visaoLogado.style.display = 'none';
    }
});