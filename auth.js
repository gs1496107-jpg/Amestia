// Substituímos a versão 12.16.0 pela 10.12.2 que é oficial e estável[span_0](start_span)[span_0](end_span)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// Importa as funções de Autenticação na MESMA versão[span_1](start_span)[span_1](end_span)
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// A sua configuração real do Firebase[span_2](start_span)[span_2](end_span)
const firebaseConfig = {
    apiKey: "AIzaSyCC2hfTgTHbbQLUp0HaxxzUhfy6BCHh21o",
    authDomain: "amestia.firebaseapp.com",
    projectId: "amestia",
    storageBucket: "amestia.firebasestorage.app",
    messagingSenderId: "201084736589",
    appId: "1:201084736589:web:a3001e640ff75397543804",
    measurementId: "G-LD0DPFDWDV"
};

// Inicializa o Firebase e o Analytics[span_3](start_span)[span_3](end_span)
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa a Autenticação[span_4](start_span)[span_4](end_span)
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Busca o elemento do menu onde o nome aparece[span_5](start_span)[span_5](end_span)
const profileLink = document.getElementById('nav-profile-link');

// Função para fazer login via Popup[span_6](start_span)[span_6](end_span)
async function loginComGoogle() {
    try {
        await signInWithPopup(auth, provider);[span_7](start_span)[span_7](end_span)
    } catch (error) {
        console.error("Erro no login:", error);[span_8](start_span)[span_8](end_span)
    }
}

// Função para deslogar[span_9](start_span)[span_9](end_span)
async function sair(evento) {
    evento.preventDefault();[span_10](start_span)[span_10](end_span)
    try {
        await signOut(auth);[span_11](start_span)[span_11](end_span)
        console.log("Usuário deslogado");[span_12](start_span)[span_12](end_span)
    } catch (error) {
        console.error("Erro ao deslogar:", error);[span_13](start_span)[span_13](end_span)
    }
}

// Busca os elementos das telas no HTML[span_14](start_span)[span_14](end_span)
const visaoDeslogado = document.getElementById('visao-deslogado');
const visaoLogado = document.getElementById('visao-logado');

// Monitora o estado da autenticação[span_15](start_span)[span_15](end_span)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // --- USUÁRIO LOGADO ---[span_16](start_span)[span_16](end_span)
        const primeiroNome = user.displayName.split(' ')[0];[span_17](start_span)[span_17](end_span)
        
        if (profileLink) {
            profileLink.innerHTML = `${primeiroNome} <img src="${user.photoURL}" alt="Foto" style="width: 20px; height: 20px; border-radius: 50%; vertical-align: middle; margin-left: 5px;">`;[span_18](start_span)[span_18](end_span)
            profileLink.onclick = sair;[span_19](start_span)[span_19](end_span)
        }
        
        if (visaoDeslogado) visaoDeslogado.style.display = 'none';[span_20](start_span)[span_20](end_span)
        if (visaoLogado) visaoLogado.style.display = 'block';[span_21](start_span)[span_21](end_span)
        
        // =========================================================================
        // SINCRONIZAÇÃO DE DADOS LOCAIS COM A CONTA DO GOOGLE
        // =========================================================================
        
        // 1. Atualiza a foto principal do perfil caso exista no HTML (`usuario.html`)
        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
            const fotoSalva = localStorage.getItem('amestia_user_avatar');
            profileImage.src = fotoSalva || user.photoURL;
        }

        // 2. Atualiza o nome completo na aba de perfil se necessário
        const nomeHeader = document.querySelector('.user-info h1');
        if (nomeHeader) {
            nomeHeader.innerHTML = `${user.displayName} <span class="user-tag">#${user.uid.slice(0, 4)}</span>`;
        }

        // 3. Puxa os dados salvos no localStorage (personagens, campanhas e tempo de jogo)
        const personagens = JSON.parse(localStorage.getItem('amestia_personagens')) || [];
        const campanhas = JSON.parse(localStorage.getItem('campanhasSalvas')) || [];
        const tempoDeJogoMinutos = localStorage.getItem('amestia_tempo_jogo') || '340';

        // 4. Injeta dinamicamente nas Estatísticas Rápidas do `usuario.html`
        const quickStats = document.querySelector('.user-quick-stats');
        if (quickStats) {
            quickStats.innerHTML = `
                <span><i class="fas fa-clock"></i> ${tempoDeJogoMinutos}h de Jogo</span>
                <span><i class="fas fa-book"></i> ${campanhas.length} Campanhas Concluídas</span>
                <span><i class="fas fa-users"></i> ${personagens.length} Personagens Criados</span>
            `;
        }

        // 5. Atualiza o contador de slots na página de personagens (`perfil.html`)
        const contadorSlots = document.getElementById('contador-slots');
        if (contadorSlots) {
            contadorSlots.innerHTML = `<i class="fas fa-users"></i> ${personagens.length} / 10 Slots`;
        }

    } else {
        // --- USUÁRIO DESLOGADO ---[span_22](start_span)[span_22](end_span)
        if (profileLink) {
            profileLink.innerHTML = `Conectar <i class="fas fa-google"></i>`;[span_23](start_span)[span_23](end_span)
            profileLink.onclick = (evento) => {[span_24](start_span)[span_24](end_span)
                evento.preventDefault();[span_25](start_span)[span_25](end_span)
                loginComGoogle();[span_26](start_span)[span_26](end_span)
            };
        }

        if (visaoDeslogado) visaoDeslogado.style.display = 'block';[span_27](start_span)[span_27](end_span)
        if (visaoLogado) visaoLogado.style.display = 'none';[span_28](start_span)[span_28](end_span)
    }
});
