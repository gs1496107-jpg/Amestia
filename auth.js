// Importa as funções principais e de Analytics do seu código original
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";

// Importa as funções de Autenticação na MESMA versão (12.16.0)
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

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

// Busca o elemento do menu onde o nome aparece (o ID que adicionamos no HTML)
const profileLink = document.getElementById('nav-profile-link');

// Função para fazer login com o Google
async function loginComGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Usuário logado:", user.displayName);
    } catch (error) {
        console.error("Erro no login:", error);
    }
}

// Função para deslogar
async function sair(evento) {
    evento.preventDefault(); // Evita que o link recarregue a página
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
        
        // Atualiza a barra de navegação
        profileLink.innerHTML = `${primeiroNome} <img src="${user.photoURL}" alt="Foto" style="width: 20px; height: 20px; border-radius: 50%; vertical-align: middle; margin-left: 5px;">`;
        profileLink.onclick = sair; 
        
        // Mostra o perfil e esconde a tela de bloqueio
        if (visaoDeslogado) visaoDeslogado.style.display = 'none';
        if (visaoLogado) visaoLogado.style.display = 'block';
        
    } else {
        // --- USUÁRIO DESLOGADO ---
        profileLink.innerHTML = `Conectar <i class="fas fa-google"></i>`;
        
        profileLink.onclick = (evento) => {
            evento.preventDefault();
            loginComGoogle();
        };

        // Mostra a tela de bloqueio e esconde o perfil
        if (visaoDeslogado) visaoDeslogado.style.display = 'block';
        if (visaoLogado) visaoLogado.style.display = 'none';
    }
});