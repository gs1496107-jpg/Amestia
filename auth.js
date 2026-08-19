import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCC2hfTgTHbbQLUp0HaxxzUhfy6BCHh21o",
    authDomain: "amestia.firebaseapp.com",
    projectId: "amestia",
    storageBucket: "amestia.firebasestorage.app",
    messagingSenderId: "201084736589",
    appId: "1:201084736589:web:a3001e640ff75397543804",
    measurementId: "G-LD0DPFDWDV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Garante persistência da sessão no navegador
setPersistence(auth, browserLocalPersistence);

const profileLink = document.getElementById('nav-profile-link');
const visaoDeslogado = document.getElementById('visao-deslogado');
const visaoLogado = document.getElementById('visao-logado');
const btnLoginGoogle = document.getElementById('btnLoginGoogle');

async function loginComGoogle() {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Erro no login:", error);
    }
}

async function sair(evento) {
    if (evento) evento.preventDefault();
    try {
        await signOut(auth);
        window.location.reload();
    } catch (error) {
        console.error("Erro ao deslogar:", error);
    }
}

if (btnLoginGoogle) {
    btnLoginGoogle.addEventListener('click', loginComGoogle);
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        const primeiroNome = user.displayName.split(' ')[0];
        
        if (profileLink) {
            profileLink.innerHTML = `${primeiroNome} <img src="${user.photoURL}" alt="Foto" style="width: 20px; height: 20px; border-radius: 50%; vertical-align: middle; margin-left: 5px;">`;
            // Mantém o link direcionando para o perfil sem deslogar
            profileLink.href = "usuario.html"; 
            profileLink.onclick = null;
        }
        
        if (visaoDeslogado) visaoDeslogado.style.display = 'none';
        if (visaoLogado) visaoLogado.style.display = 'block';

        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
            const fotoSalva = localStorage.getItem('amestia_user_avatar');
            profileImage.src = fotoSalva || user.photoURL;
        }

        const nomeHeader = document.querySelector('.user-info h1');
        if (nomeHeader) {
            nomeHeader.innerHTML = `${user.displayName} <span class="user-tag">#${user.uid.slice(0, 4)}</span>`;
        }

        const personagens = JSON.parse(localStorage.getItem('amestia_personagens')) || [];
        const campanhas = JSON.parse(localStorage.getItem('minhas_salas_rpg')) || [];
        const tempoDeJogoMinutos = localStorage.getItem('amestia_tempo_jogo') || '340';

        const quickStats = document.querySelector('.user-quick-stats');
        if (quickStats) {
            quickStats.innerHTML = `
                <span><i class="fas fa-clock"></i> ${tempoDeJogoMinutos}h de Jogo</span>
                <span><i class="fas fa-book"></i> ${campanhas.length} Campanhas Concluídas</span>
                <span><i class="fas fa-users"></i> ${personagens.length} Personagens Criados</span>
            `;
        }
    } else {
        if (profileLink) {
            profileLink.innerHTML = `Conectar <i class="fas fa-google"></i>`;
            profileLink.href = "#";
            profileLink.onclick = (evento) => {
                evento.preventDefault();
                loginComGoogle();
            };
        }

        if (visaoDeslogado) visaoDeslogado.style.display = 'block';
        if (visaoLogado) visaoLogado.style.display = 'none';
    }
});
