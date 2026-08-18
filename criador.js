// ===============================================
// SISTEMA DE NAVEGAÇÃO DE ETAPAS E ESTADO
// ===============================================
let currentStep = 1;
const totalSteps = 9;
const TOTAL_ATTR_POINTS = 3; // Pontos livres para gastar

const stepTitles = [
    "Etapa 1: Identidade",
    "Etapa 2: Raça/Origem",
    "Etapa 3: Atributos",
    "Etapa 4: Ocupação",
    "Etapa 5: Perícias",
    "Etapa 6: Constelação",
    "Etapa 7: Caminho",
    "Etapa 8: Âncoras",
    "Etapa 9: Finalização"
];

const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');

// ===============================================
// BANDO DE DADOS OFICIAIS
// ===============================================
const racas = [
    { id: 'r1', nome: "Os Cárneos", lore: "A 'bateria existencial' quebrou e o corpo parou de produzir a energia que o amarra à realidade.", tracos: ["Sem Reflexo", "Hematocinese"] },
    { id: 'r2', nome: "Os Ferais", lore: "Transformação nascida de trauma absoluto ou instinto de sobrevivência.", tracos: ["Predador Perfeito", "Mente Bestial"] },
    { id: 'r3', nome: "Filhos da Falha", lore: "Humanos expostos ao Absurdo cujo corpo sofreu erro de leitura.", tracos: ["Anomalia Física", "Inumanos"] },
    { id: 'r4', nome: "Os Liminares", lore: "Pessoas que caíram nas frestas do mundo e voltaram alteradas.", tracos: ["Físico Incompleto"] }
];

const ocupacoes = [
    { id: 'o1', nome: "Vidente / Cartomante", desc: "Atributo: Percepção ou Influência.", abs: "Ler a intenção de clientes através de símbolos e notar coincidências intencionais." },
    { id: 'o2', nome: "Parapsicólogo", desc: "Atributo: Cognição.", abs: "Isolar fraudes e identificar vestígios magnéticos anômalos." },
    { id: 'o3', nome: "Médium / Espiritista", desc: "Atributo: Âncora ou Percepção.", abs: "Sentir flutuações de ambiente e evitar pânico místico leve." },
    { id: 'o4', nome: "Detetive Particular", desc: "Atributo: Percepção.", abs: "Encontrar pistas físicas ocultas e sinais de arrombamento." },
    { id: 'o5', nome: "Paramédico / Socorrista", desc: "Atributo: Âncora.", abs: "Estancar sangramentos críticos e manter feridos graves vivos." },
    { id: 'o6', nome: "Hacker / Eng. Software", desc: "Atributo: Cognição.", abs: "Invasão de servidores e quebra de criptografias civis." }
];

const constelacoes = [
    { id: 'c1', nome: "Kritérion, O Peso Nulo", frase: "Toda ação exige um preço." },
    { id: 'c2', nome: "Senhor das Cartas Marcadas", frase: "A banca sempre vence no final." },
    { id: 'c3', nome: "Senhor das Páginas Ocultas", frase: "O que é dito não é o que é real." },
    { id: 'c4', nome: "Dama do Véu Estrelado", frase: "O tempo não é linear." },
    { id: 'c5', nome: "O Escultor da Carne (Plástis)", frase: "A biologia em seu estado mais violento." },
    { id: 'c6', nome: "O Coração Despedaçado", frase: "A dor é a única arte real." }
];

const caminhos = [
    {
        id: "morte",
        nome: "Caminho da Morte",
        descricao: '"Esta cidade gasta rios de carvão para fingir que o progresso é eterno. Eles esquecem que a engrenagem mais perfeita de todas é aquela que reduz tudo ao pó."',
        habilidades: `
            <h4>Grau 1: O Coletor de Cinzas</h4>
            <p><strong>Toque de Ocaso [Passiva]:</strong> Sempre que manifestar o Dado 1, a quebra psíquica acelera o tempo linear ao seu redor. Ganha a Verdade Oculta e faz uma estrutura inanimada próxima ou Máscara de NP 1 sofrer putrefação instantânea.</p>
            <p><strong>A Morte Chega para Todos [Passiva]:</strong> Você se torna incapaz de morrer por armas normais. Caso sofra um ataque que seria letal por meios mundanos, você fica apenas desacordado, revivendo com 100% dos seus status após o período de um dia.</p>
            
            <h4>Grau 2: A Ceifa Sombria</h4>
            <p><strong>Colheita [Ativa - Reação]:</strong> Quando uma Máscara menor for derrotada, o próximo aliado a agir recebe Vantagem (+1d20). Custo: 2 PF + 1d4 pontos de Sanidade.</p>
            <p><strong>Foice de Tanatus [Ativa]:</strong> Invoca uma foice negra feita de sombras puras. A cada golpe bem-sucedido, você recupera 1d4 de vida. Custo: 2 PF.</p>
        `
    },
    {
        id: "temperanca",
        nome: "Caminho da Temperança",
        descricao: '"O Abismo é um ácido que corrói a realidade. Mas até o pior dos ácidos pode ser neutralizado se você souber exatamente quantas gotas de lucidez deve despejar na mistura."',
        habilidades: `
            <h4>Grau 1: O Destilador de Choques</h4>
            <p><strong>Filtro Alquímico [Passiva]:</strong> Ao manifestar o Dado 1, recebe a Verdade Oculta, mas vira uma Carga Volátil (use para Vantagem +1d20).</p>
            <p><strong>Corpo Maleável [Passiva]:</strong> Maestria biológica, capaz de transferir livremente ferimentos de um local para o outro em seu corpo.</p>
            
            <h4>Grau 2: A Tintura de Calma</h4>
            <p><strong>Diluição Simbólica [Ativa - Reação]:</strong> Divide o dano total igualmente entre você e o alvo original. Custo: 3 PF + 1d4+2 pontos de Sanidade.</p>
            <p><strong>Investigando Componentes [Ativa]:</strong> Revela ingredientes de fluidos ou poções. Custo: 2 PF + 1d6 de sanidade.</p>
        `
    },
    {
        id: "cavalheiro",
        nome: "Caminho do Cavalheiro",
        descricao: '"O sangue não corre por pressão, mas porque eu me recuso a esquecer o Conceito de Estar Vivo. Minha vontade é a única física que reconheço aqui dentro."',
        habilidades: `
            <h4>Grau 1: O Sentinela da Penumbra</h4>
            <p><strong>Retórica Vital [Passiva]:</strong> Você e aliados a até 3 metros ignoram o estresse biológico inicial do Plano Espiritual.</p>
            <p><strong>Espada Vorpal [Ativa]:</strong> Invoca uma espada mística que causa 1d8 de dano de corte. Custo: 1 PF.</p>
            
            <h4>Grau 2: A Égide de Lembranças</h4>
            <p><strong>Escudo da Memória [Ativa - Reação]:</strong> Absorve o impacto mental de um aliado (Ruído Akedôntico). Custo: 2 PF + 1d4 de Sanidade Atual.</p>
        `
    },
    {
        id: "mundo",
        nome: "Caminho do Mundo",
        descricao: '"O Abismo pensa que pode engolir fragmento por fragmento. Ele esquece que a Realidade não é uma colcha de retalhos, mas uma obra perfeita."',
        habilidades: `
            <h4>Grau 1: O Andarilho do Globo</h4>
            <p><strong>Passo Cosmopolita [Passiva]:</strong> Ignora penalidades de movimento. Ao manifestar o Dado 1, sua velocidade dobra na rodada.</p>
            <p><strong>Conexão Telúrica [Ativa]:</strong> Sente as linhas de força de uma sala revelando passagens secretas. Custo: 1 PF.</p>

            <h4>Grau 2: A Linha do Horizonte</h4>
            <p><strong>Expansão de Espaço [Ativa]:</strong> Altera as dimensões da sala por 2 rodadas. Custo: 2 PF + 1d4 de Sanidade Atual.</p>
        `
    }
];

// ===============================================
// LÓGICA DE NAVEGAÇÃO E VALIDAÇÃO
// ===============================================
function updateWizard() {
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));

    const etapaAtual = document.getElementById(`step${currentStep}`);
    if (etapaAtual) etapaAtual.classList.add('active');
    
    const progresso = (currentStep / totalSteps) * 100;
    document.querySelector('.progress-bar').style.setProperty('--progress-width', `${progresso}%`);
    document.getElementById('stepTitle').innerText = stepTitles[currentStep - 1];

    btnPrev.disabled = (currentStep === 1);
    
    if (currentStep === totalSteps) {
        btnNext.style.display = 'none'; // Esconde o botão Próximo na última tela
        gerarResumo(); 
    } else {
        btnNext.style.display = 'block';
        btnNext.innerText = "Próximo Passo";
    }
}

function validarEtapaAtual() {
    if (currentStep === 1) {
        const nome = document.getElementById('charName').value.trim();
        if (!nome) {
            alert("Por favor, preencha o nome do personagem.");
            return false;
        }
    }
    if (currentStep === 3) {
        const pontosUsados = calcularPontosUsados();
        if (pontosUsados > TOTAL_ATTR_POINTS) {
            alert(`Você distribuiu ${pontosUsados} pontos. O máximo permitido é ${TOTAL_ATTR_POINTS}.`);
            return false;
        }
    }
    return true;
}

btnNext.addEventListener('click', () => {
    if (!validarEtapaAtual()) return;
    
    if (currentStep < totalSteps) { 
        currentStep++; 
        updateWizard(); 
    }
});

btnPrev.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateWizard();
    }
});

// ===============================================
// SELEÇÃO DE GRIDS
// ===============================================
function criarSelecao(lista, gridId, panelId, updatePanelFn) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    lista.forEach(item => {
        const div = document.createElement('div');
        div.className = 'select-card';
        div.innerText = item.nome;
        div.onclick = () => {
            document.querySelectorAll(`#${gridId} .select-card`).forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            updatePanelFn(item);
        };
        grid.appendChild(div);
    });
}

criarSelecao(racas, 'raceGrid', 'raceDetails', (raca) => {
    document.getElementById('raceName').innerText = raca.nome;
    document.getElementById('raceLore').innerText = raca.lore;
    document.getElementById('raceTraits').innerHTML = raca.tracos.map(t => `<li>${t}</li>`).join('');
});

criarSelecao(ocupacoes, 'jobGrid', 'jobDetails', (job) => {
    document.getElementById('jobName').innerText = job.nome;
    document.getElementById('jobDesc').innerText = job.desc;
    document.getElementById('jobAbs').innerText = job.abs;
});

// Atualizado para receber os dados complexos dos caminhos (lore + habilidades)
criarSelecao(caminhos, 'pathGrid', 'pathDetails', (cam) => {
    document.getElementById('pathName').innerText = cam.nome;
    document.getElementById('pathLore').innerHTML = `<em>${cam.descricao}</em>`;
    document.getElementById('pathSkills').innerHTML = cam.habilidades;
});

const constGrid = document.getElementById('constellationGrid');
if (constGrid) {
    constGrid.innerHTML = '';
    constelacoes.forEach(c => {
        const card = document.createElement('div');
        card.className = 'constellation-card';
        card.innerHTML = `<div class="constellation-info"><h4>${c.nome}</h4><p>${c.frase}</p></div>`;
        card.onclick = () => {
            document.querySelectorAll('.constellation-card').forEach(el => el.classList.remove('selected'));
            card.classList.add('selected');
            document.getElementById('constName').innerText = c.nome;
            document.getElementById('constLore').innerText = c.frase;
        };
        constGrid.appendChild(card);
    });
}

// ===============================================
// CÁLCULO DE ATRIBUTOS E DERIVADOS (OFICIAL)
// ===============================================
const attrs = document.querySelectorAll('.attr-input');
attrs.forEach(input => input.addEventListener('input', () => {
    validarLimitesAtributos(input);
    calcularSecundarios();
}));

function calcularPontosUsados() {
    let total = 0;
    attrs.forEach(input => {
        const val = parseInt(input.value) || 1;
        total += Math.max(0, val - 1); 
    });
    return total;
}

function validarLimitesAtributos(inputAtual) {
    let val = parseInt(inputAtual.value) || 1;
    if (val < 1) inputAtual.value = 1;
    if (val > 3) inputAtual.value = 3;

    const pontosUsados = calcularPontosUsados();
    const restantes = TOTAL_ATTR_POINTS - pontosUsados;
    
    const displayPontos = document.getElementById('pointsLeft');
    if (displayPontos) {
        displayPontos.innerText = restantes;
        displayPontos.style.color = restantes < 0 ? '#ff4d4d' : 'var(--accent-purple)';
    }
}

function calcularSecundarios() {
    const pro = parseInt(document.getElementById('attrProeza').value) || 1;
    const cog = parseInt(document.getElementById('attrCognicao').value) || 1;
    const anc = parseInt(document.getElementById('attrAncora').value) || 1;
    const grau = 1;

    const vit = 10 + (pro * 5);
    const san = 10 + (anc * 5);
    const flux = 3 + grau + anc;
    const slots = 3 + pro;
    const maxSkills = 2 + cog;

    document.getElementById('statVit').innerText = vit; 
    document.getElementById('statSan').innerText = san; 
    document.getElementById('statFlux').innerText = flux; 
    document.getElementById('statSlots').innerText = slots;
    
    const maxSkillsSpan = document.getElementById('maxSkillsNum');
    if (maxSkillsSpan) maxSkillsSpan.innerText = maxSkills;
    
    atualizarTravaPericias(maxSkills);
}

// ===============================================
// PERÍCIAS
// ===============================================
function atualizarTravaPericias(maxPermitido) {
    const skillCbs = document.querySelectorAll('.skill-cb');
    const marcadas = document.querySelectorAll('.skill-cb:checked');

    if (marcadas.length > maxPermitido) {
        skillCbs.forEach(cb => cb.checked = false);
        alert(`O limite de perícias mudou para ${maxPermitido} com base na sua Cognição. Suas escolhas foram resetadas.`);
    }

    skillCbs.forEach(cb => {
        cb.onclick = () => {
            const atuais = document.querySelectorAll('.skill-cb:checked').length;
            if (atuais > maxPermitido) {
                cb.checked = false;
                alert(`Sua Cognição permite escolher no máximo ${maxPermitido} perícias.`);
            }
        };
    });
}

// ===============================================
// LEITOR DE FOTO
// ===============================================
const campoArquivo = document.getElementById('charImageFile');
const campoInvisivelTexto = document.getElementById('charImageBase64');
const areaVisualizacao = document.getElementById('imagePreview');

if (campoArquivo) {
    campoArquivo.addEventListener('change', function(event) {
        const foto = event.target.files[0];
        if (foto) {
            const leitor = new FileReader();
            leitor.onload = function(e) {
                campoInvisivelTexto.value = e.target.result;
                areaVisualizacao.innerHTML = `<img src="${e.target.result}" style="max-width:120px; max-height:120px; border-radius:8px; border:2px solid var(--accent-purple);">`;
            };
            leitor.readAsDataURL(foto);
        }
    });
}

// ===============================================
// RESUMO FINAL E EXPORTAÇÃO
// ===============================================
function gerarResumo() {
    const nome = document.getElementById('charName').value || "Desconhecido";
    const racaSelected = document.querySelector('#raceGrid .selected');
    const jobSelected = document.querySelector('#jobGrid .selected');
    const pathSelected = document.querySelector('#pathGrid .selected');
    const constSelected = document.querySelector('.constellation-card.selected h4');
    const imgBase64 = document.getElementById('charImageBase64').value;

    document.getElementById('finalName').innerText = nome;
    document.getElementById('finalRace').innerText = racaSelected ? racaSelected.innerText : "Sem Origem";
    document.getElementById('finalJob').innerText = jobSelected ? jobSelected.innerText : "Sem Ocupação";
    document.getElementById('finalPath').innerText = pathSelected ? pathSelected.innerText : "Sem Caminho";

    const previewContainer = document.getElementById('summaryPreview');
    if (imgBase64 && previewContainer) {
        previewContainer.innerHTML = `<img src="${imgBase64}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-purple);">`;
    }

    const pericias = Array.from(document.querySelectorAll('.skill-cb:checked')).map(cb => cb.value);

    document.getElementById('summaryDetails').innerHTML = `
        <p><strong>Vitalidade:</strong> ${document.getElementById('statVit').innerText} | <strong>Sanidade:</strong> ${document.getElementById('statSan').innerText} | <strong>Fluxo:</strong> ${document.getElementById('statFlux').innerText}</p>
        <p><strong>Constelação:</strong> ${constSelected ? constSelected.innerText : "Não selecionada"}</p>
        <p><strong>Perícias Escolhidas:</strong> ${pericias.join(', ') || "Nenhuma"}</p>
        <p><strong>Âncoras:</strong> ${document.getElementById('anchorPerson').value || "-"} (Pessoa), ${document.getElementById('anchorPlace').value || "-"} (Lugar), ${document.getElementById('anchorObject').value || "-"} (Objeto)</p>
    `;
}

function exportarJSON() {
    const nome = document.getElementById('charName').value || "personagem";
    const dados = {
        nome: nome,
        idade: document.getElementById('charAge').value,
        pronome: document.getElementById('charPronoun').value,
        habilidadeInata: document.getElementById('charInnate').value,
        atributos: {
            proeza: document.getElementById('attrProeza').value,
            percepcao: document.getElementById('attrPercepcao').value,
            cognicao: document.getElementById('attrCognicao').value,
            influencia: document.getElementById('attrInfluencia').value,
            ancora: document.getElementById('attrAncora').value
        },
        stats: {
            vitalidade: document.getElementById('statVit').innerText,
            sanidade: document.getElementById('statSan').innerText,
            fluxo: document.getElementById('statFlux').innerText,
            slots: document.getElementById('statSlots').innerText
        },
        ancorasLiterais: {
            pessoa: document.getElementById('anchorPerson').value,
            lugar: document.getElementById('anchorPlace').value,
            objeto: document.getElementById('anchorObject').value
        }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dados, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${nome.toLowerCase().replace(/\s+/g, '_')}_ficha.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

window.salvarNovoPersonagem = function() {
    const racaSelected = document.querySelector('#raceGrid .selected');
    const jobSelected = document.querySelector('#jobGrid .selected');
    const pathSelected = document.querySelector('#pathGrid .selected');
    
    const imgInput = document.getElementById('charImageBase64').value;
    const imagemFinal = imgInput ? imgInput : "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";

    const novoPersonagem = {
        id: Date.now(),
        nome: document.getElementById('charName').value || "Desconhecido",
        imagem: imagemFinal,
        conceito: (racaSelected ? racaSelected.innerText : "Sem Origem") + " | " + (pathSelected ? pathSelected.innerText : "Sem Caminho"),
        grau: 1, 
        ocupacao: jobSelected ? jobSelected.innerText : "Sem Ocupação",
        habilidadeInata: document.getElementById('charInnate').value || "Nenhuma habilidade inata definida.", 
        vitalidade: parseInt(document.getElementById('statVit').innerText) || 15,
        sanidade: parseInt(document.getElementById('statSan').innerText) || 15,
        fluxo: parseInt(document.getElementById('statFlux').innerText) || 10,
        estresse: 0,
        atributos: {
            proeza: document.getElementById('attrProeza').value,
            percepcao: document.getElementById('attrPercepcao').value,
            cognicao: document.getElementById('attrCognicao').value,
            influencia: document.getElementById('attrInfluencia').value,
            ancora: document.getElementById('attrAncora').value
        }
    };

    let bancoDePersonagens = JSON.parse(localStorage.getItem('amestia_personagens')) || [];
    bancoDePersonagens.push(novoPersonagem);
    localStorage.setItem('amestia_personagens', JSON.stringify(bancoDePersonagens));

    alert("Personagem salvo com sucesso!");
    window.location.href = "perfil.html";
};

// Inicialização
updateWizard();
calcularSecundarios();
