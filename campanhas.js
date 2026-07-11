// ==========================================
// CONFIGURAÇÃO DE ACESSO (Mestre vs Player)
// ==========================================
let isMestre = true; // Mude para false para ver como os jogadores enxergam a tela

// ==========================================
// BANCO DE DADOS LOCAL (LOCALSTORAGE)
// ==========================================
// Carrega as campanhas salvas ou cria uma lista vazia
let minhasCampanhas = JSON.parse(localStorage.getItem('campanhasSalvas')) || [];

// Ao carregar a página, desenha as campanhas salvas no Lobby
window.onload = () => {
    renderizarLobby();
};

function salvarNoNavegador() {
    localStorage.setItem('campanhasSalvas', JSON.stringify(minhasCampanhas));
}

function renderizarLobby() {
    const grid = document.querySelector('#campanhasLobby .campaign-grid');
    if (!grid) return;

    // Remove os cartões dinâmicos antigos para não duplicar ao recarregar
    document.querySelectorAll('.cartao-dinamico').forEach(el => el.remove());

    // Desenha cada campanha salva
    minhasCampanhas.forEach((camp, index) => {
        const novoCartao = document.createElement('div');
        novoCartao.className = 'campaign-card cartao-dinamico';
        novoCartao.innerHTML = `
            <img src="${camp.img}" alt="Capa" class="campaign-img" onclick="entrarCampanha('${camp.nome}', '${camp.codigo}')">
            <div class="campaign-info">
                <h2 onclick="entrarCampanha('${camp.nome}', '${camp.codigo}')">${camp.nome}</h2>
                <p style="color: #7a1b9c; font-weight: bold; font-size: 0.85rem; letter-spacing: 1px;"><i class="fas fa-key"></i> Código: ${camp.codigo}</p>
                <p><strong>Mestre:</strong> ${camp.mestre}</p>
                <button class="btn-remover-card" onclick="apagarCampanha(${index})"><i class="fas fa-trash"></i> Abandonar Campanha</button>
            </div>
        `;
        grid.appendChild(novoCartao);
    });
}

function apagarCampanha(index) {
    if (confirm("Tem certeza que deseja apagar o registro desta campanha?")) {
        minhasCampanhas.splice(index, 1); // Remove da lista
        salvarNoNavegador(); // Atualiza o banco de dados
        renderizarLobby(); // Atualiza a tela
    }
}

// ==========================================
// NAVEGAÇÃO DE TELAS
// ==========================================
const lobby = document.getElementById('campanhasLobby');
const campanhaInterna = document.getElementById('campanhaInterna');
const telaCriarCampanha = document.getElementById('telaCriarCampanha');
const titleDisplay = document.getElementById('campaignTitleDisplay');

function entrarCampanha(nome, codigo = "") {
    if (lobby) lobby.classList.remove('active');
    if (campanhaInterna) campanhaInterna.classList.add('active');
    
    if (titleDisplay) {
        titleDisplay.innerHTML = codigo ? `${nome} <span style="font-size: 0.8rem; color: #888; display: block; margin-top: 5px;"><i class="fas fa-key"></i> ${codigo}</span>` : nome;
    }
    aplicarPermissoes();
}

function voltarLobby() {
    if (campanhaInterna) campanhaInterna.classList.remove('active');
    if (telaCriarCampanha) telaCriarCampanha.classList.remove('active');
    if (lobby) lobby.classList.add('active');
}

function abrirCriacaoCampanha() {
    if (lobby) lobby.classList.remove('active');
    if (campanhaInterna) campanhaInterna.classList.remove('active');
    if (telaCriarCampanha) telaCriarCampanha.classList.add('active');
}

function openCamTab(evt, tabName) {
    document.querySelectorAll('.campaign-content .tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.campaign-nav .tab-btn').forEach(b => b.classList.remove('active'));
    
    const abaAlvo = document.getElementById(tabName);
    if (abaAlvo) abaAlvo.classList.add('active');
    if (evt && evt.currentTarget) evt.currentTarget.classList.add('active');
}

// ==========================================
// GERADOR, CRIAÇÃO E ENTRADA
// ==========================================
function gerarCodigoConvite() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let res = '';
    for (let i = 0; i < 6; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    return `RPG-${res}`;
}

function salvarCampanha() {
    const nomeInput = document.getElementById('novaCamNome');
    const nome = nomeInput ? nomeInput.value.trim() : "";
    const img = document.getElementById('novaCamImg').value || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";
    
    if (!nome) { alert("Sua campanha precisa de um nome!"); return; }

    const codigoGerado = gerarCodigoConvite();
    
    // Salva no LocalStorage
    minhasCampanhas.push({ nome: nome, img: img, codigo: codigoGerado, mestre: "Você" });
    salvarNoNavegador();
    renderizarLobby();

    alert(`A campanha "${nome}" foi forjada com sucesso!\nCompartilhe o código com seus jogadores: ${codigoGerado}`);
    
    if (nomeInput) nomeInput.value = "";
    document.getElementById('novaCamImg').value = "";
    document.getElementById('novaCamDesc').value = "";
    
    if (telaCriarCampanha) telaCriarCampanha.classList.remove('active');
    entrarCampanha(nome, codigoGerado);
}

function entrarPorCodigo() {
    const codigo = prompt("Digite o código de convite (Ex: RPG-XXXXXX):");
    if (!codigo) return;

    const codigoFormatado = codigo.toUpperCase().trim();
    const nome = 'Sessão ' + codigoFormatado;
    const img = "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";

    // Salva no LocalStorage como Jogador
    minhasCampanhas.push({ nome: nome, img: img, codigo: codigoFormatado, mestre: "Desconhecido" });
    salvarNoNavegador();
    renderizarLobby();

    alert(`Sucesso! Você se conectou à sala ${codigoFormatado}.`);
    entrarCampanha(nome, codigoFormatado);
}

// ==========================================
// GERENCIAR PERSONAGENS / JOGADORES
// ==========================================
function adicionarJogador() {
    // Puxa exatamente a chave que você usou no criador.html
    const personagensLocais = JSON.parse(localStorage.getItem('amestia_personagens')) || [];

    if (personagensLocais.length === 0) {
        alert("Nenhum personagem encontrado no banco de dados! Crie um no 'Criador' primeiro.");
        return;
    }

    // Monta uma lista para o Mestre escolher
    let listaTexto = "Qual personagem você deseja adicionar à campanha?\n(Digite o número correspondente):\n\n";
    personagensLocais.forEach((p, index) => {
        listaTexto += `[ ${index + 1} ] ${p.nome} (${p.ocupacao})\n`;
    });

    const escolha = prompt(listaTexto);
    if (!escolha) return; 

    const indexEscolhido = parseInt(escolha) - 1;
    
    // Valida se o mestre digitou um número válido
    if (isNaN(indexEscolhido) || indexEscolhido < 0 || indexEscolhido >= personagensLocais.length) {
        alert("Opção inválida. Tente novamente.");
        return;
    }

    // Pega o personagem escolhido
    const perso = personagensLocais[indexEscolhido];
    
    // Como o Criador não salva o nome de quem joga, perguntamos apenas isso ao Mestre na hora de puxar
    const nomeJogador = prompt(`Quem é o jogador que vai controlar ${perso.nome}?`) || "Desconhecido";

    const grid = document.getElementById('gridJogadores');
    if (!grid) return;

    const novoCard = document.createElement('div');
    novoCard.className = 'campaign-card';
    novoCard.innerHTML = `
        <img src="${perso.imagem}" alt="${perso.nome}" class="campaign-img">
        <div class="campaign-info">
            <h2 contenteditable="true">${perso.nome}</h2>
            <p><strong>Jogador:</strong> <span contenteditable="true">${nomeJogador}</span></p>
            <p><strong>Conceito:</strong> <span contenteditable="true">${perso.conceito}</span></p>
            <p class="last-session">
                <i class="fas fa-heart"></i> PV: ${perso.vitalidade} | <i class="fas fa-brain"></i> SAN: ${perso.sanidade}
            </p>
            <button class="btn-remover-card btn-mestre-only" onclick="removerElemento(this)">Remover Personagem</button>
        </div>
    `;
    grid.appendChild(novoCard);
}

// ==========================================
// PERMISSÕES GERAIS E RELÓGIO
// ==========================================
function aplicarPermissoes() {
    const body = document.body;
    if (isMestre) {
        body.classList.remove('visao-jogador');
    } else {
        body.classList.add('visao-jogador');
    }

    const abasSomenteMestre = ['VisaoGeral', 'Jogadores', 'Calendario', 'Mestre'];
    const abasLivres = ['Diario', 'Evidencias', 'Arquivos', 'Locais', 'Chat', 'NPCs'];

    const botaoEscudo = document.querySelector('button[onclick*="openCamTab(event, \'Mestre\')"]');
    if (botaoEscudo) botaoEscudo.style.display = isMestre ? 'block' : 'none';

    document.querySelectorAll('.tab-content').forEach(aba => {
        const isAbaMestre = abasSomenteMestre.includes(aba.id);
        const podeEditar = isMestre || (!isAbaMestre && abasLivres.includes(aba.id));

        aba.querySelectorAll('p:not(.last-session), h3, h4, span').forEach(el => {
            if (podeEditar) el.setAttribute('contenteditable', 'true');
            else el.removeAttribute('contenteditable');
        });

        aba.querySelectorAll('input, textarea').forEach(campo => {
            campo.disabled = !podeEditar;
            campo.style.opacity = podeEditar ? '1' : '0.6';
        });

        const btnAntigo = aba.querySelector('.btn-add-item');
        if (btnAntigo) btnAntigo.remove();

        if (podeEditar && aba.id !== 'Chat' && aba.id !== 'Mestre' && aba.id !== 'Jogadores') {
            const btnNovo = document.createElement('button');
            btnNovo.className = 'btn-add-item';
            btnNovo.innerHTML = '<i class="fas fa-plus"></i> Adicionar Novo Registro';
            btnNovo.onclick = () => adicionarNovoRegistro(aba.id);
            aba.appendChild(btnNovo);
        }
    });
}

function adicionarNovoRegistro(abaId) {
    const aba = document.getElementById(abaId);
    if (!aba) return;

    const titulo = prompt("Título do novo elemento:");
    if (!titulo) return;

    const descricao = prompt("Descrição inicial:") || "Clique para escrever...";
    const gridContainer = aba.querySelector('.evidence-grid');
    
    if (gridContainer) {
        const novoCard = document.createElement('div');
        novoCard.className = 'evidence-card animated-discovery';
        novoCard.innerHTML = `
            <h4 contenteditable="true">${titulo}</h4>
            <p contenteditable="true">${descricao}</p>
            <button class="btn-remover-card btn-mestre-only" onclick="removerElemento(this)" style="margin-top: 10px; padding: 4px;">Excluir</button>
        `;
        gridContainer.appendChild(novoCard);
    } else {
        const novaBox = document.createElement('div');
        novaBox.className = 'info-box';
        novaBox.innerHTML = `
            <h3 contenteditable="true">${titulo}</h3>
            <p contenteditable="true">${descricao}</p>
        `;
        const btnAddItem = aba.querySelector('.btn-add-item');
        if (btnAddItem) aba.insertBefore(novaBox, btnAddItem);
        else aba.appendChild(novaBox);
    }
}

// Relógio de Sombra
let shadowTicks = 0;
const maxTicks = 12;
function avancarRelogio() {
    if (shadowTicks >= maxTicks) return;
    shadowTicks++;
    const clockProgress = document.getElementById('clockProgress');
    const clockStatus = document.getElementById('clockStatus');
    if (clockProgress) clockProgress.style.height = `${(shadowTicks / maxTicks) * 100}%`;
    if (clockStatus) clockStatus.innerText = `${shadowTicks}/${maxTicks}`;
    const body = document.body;
    if (!body) return;
    body.classList.remove('shadow-mid', 'shadow-critical');
    if (shadowTicks >= 6 && shadowTicks < 12) body.classList.add('shadow-mid');
    if (shadowTicks === maxTicks) {
        body.classList.add('shadow-critical');
        setTimeout(() => {
            body.classList.remove('shadow-critical');
            alert("A realidade se estabilizou... mas algo mudou de forma permanente.");
        }, 3000);
    }
}
