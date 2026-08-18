import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove, 
    onSnapshot, 
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuração do Firebase
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
const auth = getAuth(app);
const db = getFirestore(app);

// Estado Global
let usuarioAtual = null;
let codigoCampanhaAtiva = null;
let unsubscribeCampanha = null; // Escutador em tempo real
let isMestre = false;

// ==========================================
// INICIALIZAÇÃO E AUTENTICAÇÃO
// ==========================================
onAuthStateChanged(auth, (user) => {
    usuarioAtual = user;
    carregarCampanhasDoUsuario();
});

// Tornando funções acessíveis pelo HTML (onclick)
window.abrirCriacaoCampanha = abrirCriacaoCampanha;
window.salvarCampanha = salvarCampanha;
window.entrarPorCodigo = entrarPorCodigo;
window.entrarCampanha = entrarCampanha;
window.voltarLobby = voltarLobby;
window.openCamTab = openCamTab;
window.adicionarJogador = adicionarJogador;
window.removerJogador = removerJogador;
window.apagarCampanha = apagarCampanha;
window.avancarRelogio = avancarRelogio;

// ==========================================
// LOBBY E CARREGAMENTO
// ==========================================
async function carregarCampanhasDoUsuario() {
    const grid = document.querySelector('#campanhasLobby .campaign-grid');
    if (!grid) return;

    document.querySelectorAll('.cartao-dinamico').forEach(el => el.remove());

    const campanhasSalvas = JSON.parse(localStorage.getItem('minhas_salas_rpg')) || [];

    for (const codigo of campanhasSalvas) {
        const docRef = doc(db, "campanhas", codigo);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const camp = docSnap.data();
            const qtd = camp.jogadores ? camp.jogadores.length : 0;

            const novoCartao = document.createElement('div');
            novoCartao.className = 'campaign-card cartao-dinamico';
            novoCartao.innerHTML = `
                <img src="${camp.img}" alt="Capa" class="campaign-img" onclick="entrarCampanha('${camp.codigo}')">
                <div class="campaign-info">
                    <h2 onclick="entrarCampanha('${camp.codigo}')">${camp.nome}</h2>
                    <p style="color: #7a1b9c; font-weight: bold; font-size: 0.85rem; letter-spacing: 1px;"><i class="fas fa-key"></i> Código: ${camp.codigo}</p>
                    <p><strong>Mestre:</strong> ${camp.mestreNome}</p>
                    <p><strong>Jogadores:</strong> <i class="fas fa-users"></i> ${qtd}</p>
                    <button class="btn-remover-card" onclick="apagarCampanha('${camp.codigo}')"><i class="fas fa-trash"></i> Sair / Remover</button>
                </div>
            `;
            grid.appendChild(novoCartao);
        }
    }
}

// ==========================================
// SALA EM TEMPO REAL (ON SNAPSHOT)
// ==========================================
function entrarCampanha(codigo) {
    const lobby = document.getElementById('campanhasLobby');
    const campanhaInterna = document.getElementById('campanhaInterna');
    const titleDisplay = document.getElementById('campaignTitleDisplay');

    if (lobby) lobby.classList.remove('active');
    if (campanhaInterna) campanhaInterna.classList.add('active');

    codigoCampanhaAtiva = codigo;

    // Cancela a escuta anterior se houver
    if (unsubscribeCampanha) unsubscribeCampanha();

    // Conecta ao servidor Firebase em tempo real
    unsubscribeCampanha = onSnapshot(doc(db, "campanhas", codigo), (docSnap) => {
        if (!docSnap.exists()) {
            alert("Esta campanha foi encerrada pelo mestre.");
            voltarLobby();
            return;
        }

        const dados = docSnap.data();

        // Verifica se quem está logado é o Mestre
        isMestre = usuarioAtual && usuarioAtual.uid === dados.mestreUid;
        aplicarPermissoes();

        if (titleDisplay) {
            titleDisplay.innerHTML = `${dados.nome} <span style="font-size: 0.8rem; color: #888; display: block; margin-top: 5px;"><i class="fas fa-key"></i> ${dados.codigo}</span>`;
        }

        // 1. Atualiza Lista de Jogadores para TODOS na sala
        renderizarJogadores(dados.jogadores || []);

        // 2. Atualiza Relógio para TODOS
        atualizarRelogioVisual(dados.relogio || 0);
    });
}

function renderizarJogadores(jogadores) {
    const grid = document.getElementById('gridJogadores');
    if (!grid) return;

    grid.innerHTML = ''; // Limpa a grade para reexibir atualizado

    if (jogadores.length === 0) {
        grid.innerHTML = '<p style="color: #aaa; text-align: center; grid-column: 1/-1;">Nenhum personagem foi adicionado a esta campanha ainda.</p>';
        return;
    }

    jogadores.forEach((perso, index) => {
        const card = document.createElement('div');
        card.className = 'campaign-card';
        card.innerHTML = `
            <img src="${perso.imagem || 'https://via.placeholder.com/150'}" alt="${perso.nome}" class="campaign-img">
            <div class="campaign-info">
                <h2>${perso.nome}</h2>
                <p><strong>Jogador:</strong> ${perso.jogadorNome}</p>
                <p><strong>Ocupação:</strong> ${perso.ocupacao || 'Investigador'}</p>
                <p class="last-session">
                    <i class="fas fa-heart"></i> PV: ${perso.vitalidade || 10} | <i class="fas fa-brain"></i> SAN: ${perso.sanidade || 100}
                </p>
                ${(isMestre || (usuarioAtual && usuarioAtual.uid === perso.uidDono)) ? `
                    <button class="btn-remover-card" onclick="removerJogador(${index})"><i class="fas fa-trash"></i> Remover Personagem</button>
                ` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

// ==========================================
// ADICIONAR PERSONAGEM AO SERVIDOR
// ==========================================
async function adicionarJogador() {
    if (!codigoCampanhaAtiva) return;

    // Puxa os personagens salvos localmente no criador
    const personagensLocais = JSON.parse(localStorage.getItem('amestia_personagens')) || [];

    if (personagensLocais.length === 0) {
        alert("Você não possui personagens criados! Acesse o menu 'Criar Personagem' primeiro.");
        return;
    }

    let listaTexto = "Selecione o personagem para entrar na campanha:\n\n";
    personagensLocais.forEach((p, i) => {
        listaTexto += `[ ${i + 1} ] ${p.nome} (${p.ocupacao || 'Investigador'})\n`;
    });

    const escolha = prompt(listaTexto);
    if (!escolha) return;

    const idx = parseInt(escolha) - 1;
    if (isNaN(idx) || idx < 0 || idx >= personagensLocais.length) {
        alert("Opção inválida!");
        return;
    }

    const perso = personagensLocais[idx];
    const nomeJogador = usuarioAtual ? (usuarioAtual.displayName || "Investigador") : "Anônimo";

    const novoJogadorDoc = {
        uidDono: usuarioAtual ? usuarioAtual.uid : "anonimo",
        jogadorNome: nomeJogador,
        nome: perso.nome,
        ocupacao: perso.ocupacao || "Investigador",
        vitalidade: perso.vitalidade || 10,
        sanidade: perso.sanidade || 100,
        imagem: perso.imagem || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    };

    // Atualiza o documento no Firestore -> Todos os players recebem na hora via onSnapshot
    const docRef = doc(db, "campanhas", codigoCampanhaAtiva);
    await updateDoc(docRef, {
        jogadores: arrayUnion(novoJogadorDoc)
    });
}

async function removerJogador(index) {
    if (!confirm("Deseja remover este personagem da campanha?")) return;

    const docRef = doc(db, "campanhas", codigoCampanhaAtiva);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const listaAtual = docSnap.data().jogadores || [];
        listaAtual.splice(index, 1);
        await updateDoc(docRef, { jogadores: listaAtual });
    }
}

// ==========================================
// CRIAÇÃO E CONEXÃO DE SALAS
// ==========================================
function gerarCodigoConvite() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let res = '';
    for (let i = 0; i < 6; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    return `RPG-${res}`;
}

async function salvarCampanha() {
    const nomeInput = document.getElementById('novaCamNome');
    const nome = nomeInput ? nomeInput.value.trim() : "";
    const img = document.getElementById('novaCamImg').value || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";

    if (!nome) { alert("Sua campanha precisa de um nome!"); return; }

    const codigoGerado = gerarCodigoConvite();
    const nomeMestre = usuarioAtual ? usuarioAtual.displayName : "Mestre";
    const uidMestre = usuarioAtual ? usuarioAtual.uid : "";

    // Salva a nova sala no Firestore
    await setDoc(doc(db, "campanhas", codigoGerado), {
        nome: nome,
        img: img,
        codigo: codigoGerado,
        mestreNome: nomeMestre,
        mestreUid: uidMestre,
        jogadores: [],
        relogio: 0
    });

    salvarChaveLocalmente(codigoGerado);

    alert(`Campanha "${nome}" criada!\nCódigo de acesso para os jogadores: ${codigoGerado}`);
    voltarLobby();
    carregarCampanhasDoUsuario();
}

async function entrarPorCodigo() {
    const codigo = prompt("Digite o código da campanha (Ex: RPG-XXXXXX):");
    if (!codigo) return;

    const codigoFormatado = codigo.toUpperCase().trim();
    const docRef = doc(db, "campanhas", codigoFormatado);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        alert("Campanha não encontrada! Verifique o código digitado.");
        return;
    }

    salvarChaveLocalmente(codigoFormatado);
    carregarCampanhasDoUsuario();
    entrarCampanha(codigoFormatado);
}

function salvarChaveLocalmente(codigo) {
    let salas = JSON.parse(localStorage.getItem('minhas_salas_rpg')) || [];
    if (!salas.includes(codigo)) {
        salas.push(codigo);
        localStorage.setItem('minhas_salas_rpg', JSON.stringify(salas));
    }
}

async function apagarCampanha(codigo) {
    if (!confirm("Deseja remover esta campanha do seu lobby?")) return;

    let salas = JSON.parse(localStorage.getItem('minhas_salas_rpg')) || [];
    salas = salas.filter(c => c !== codigo);
    localStorage.setItem('minhas_salas_rpg', JSON.stringify(salas));

    carregarCampanhasDoUsuario();
}

// ==========================================
// CONTROLES DE INTERFACE E RELÓGIO
// ==========================================
function voltarLobby() {
    if (unsubscribeCampanha) unsubscribeCampanha();
    const campanhaInterna = document.getElementById('campanhaInterna');
    const telaCriarCampanha = document.getElementById('telaCriarCampanha');
    const lobby = document.getElementById('campanhasLobby');

    if (campanhaInterna) campanhaInterna.classList.remove('active');
    if (telaCriarCampanha) telaCriarCampanha.classList.remove('active');
    if (lobby) lobby.classList.add('active');
}

function abrirCriacaoCampanha() {
    const lobby = document.getElementById('campanhasLobby');
    const telaCriarCampanha = document.getElementById('telaCriarCampanha');
    if (lobby) lobby.classList.remove('active');
    if (telaCriarCampanha) telaCriarCampanha.classList.add('active');
}

function openCamTab(evt, tabName) {
    document.querySelectorAll('.campaign-content .tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.campaign-nav .tab-btn').forEach(b => b.classList.remove('active'));

    const abaAlvo = document.getElementById(tabName);
    if (abaAlvo) abaAlvo.classList.add('active');
    if (evt && evt.currentTarget) evt.currentTarget.classList.add('active');
}

function aplicarPermissoes() {
    const body = document.body;
    if (isMestre) body.classList.remove('visao-jogador');
    else body.classList.add('visao-jogador');

    const botaoEscudo = document.querySelector('button[onclick*="openCamTab(event, \'Mestre\')"]');
    if (botaoEscudo) botaoEscudo.style.display = isMestre ? 'block' : 'none';
}

async function avancarRelogio() {
    if (!isMestre || !codigoCampanhaAtiva) return;

    const docRef = doc(db, "campanhas", codigoCampanhaAtiva);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let atual = docSnap.data().relogio || 0;
        let novoValor = atual >= 12 ? 0 : atual + 1;
        await updateDoc(docRef, { relogio: novoValor });
    }
}

function atualizarRelogioVisual(ticks) {
    const clockProgress = document.getElementById('clockProgress');
    const clockStatus = document.getElementById('clockStatus');
    if (clockProgress) clockProgress.style.height = `${(ticks / 12) * 100}%`;
    if (clockStatus) clockStatus.innerText = `${ticks}/12`;
}