// ===============================================
// SISTEMA DE NAVEGAÇÃO DE ETAPAS
// ===============================================
let currentStep = 1;
const totalSteps = 9;
let maxPermittedSkills = 4;

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
// DADOS OFICIAIS: O VÉU DO ABSURDO
// ===============================================

const racas = [
    { 
        id: 'r1', 
        nome: "Os Cárneos", 
        lore: "A 'bateria existencial' quebrou e o corpo parou de produzir a energia que o amarra à realidade. Precisam de sangue humano como condutor de vida e inércia para não colapsarem em pó.", 
        tracos: [
            "Sem Reflexo: A luz e o espaço 'esquecem' de interagir com eles direito.", 
            "Hematocinese: Podem manipular o próprio sangue coagulado como armas cortantes ou armadura."
        ] 
    },
    { 
        id: 'r2', 
        nome: "Os Ferais", 
        lore: "A transformação é um mecanismo de defesa psicológico que hackeou a biologia, nascendo de um trauma absoluto ou instinto de sobrevivência.", 
        tracos: [
            "Predador Perfeito: Regeneração absurda e atributos físicos além do limite humano.", 
            "Mente Bestial: Enquanto transformados, a inteligência lógica cai, guiados por fome e agressividade, queimando Sanidade a cada turno."
        ] 
    },
    { 
        id: 'r3', 
        nome: "Filhos da Falha", 
        lore: "Humanos que entraram em contato direto com o Absurdo e o corpo sofreu um erro de leitura, adaptando-se de forma bizarra.", 
        tracos: [
            "Anomalia Física: Habilidades físicas e permanentes, como ossos de vidro cortante ou sangue inflamável.", 
            "Inumanos: Impossibilidade de se passar por um humano normal."
        ] 
    },
    { 
        id: 'r4', 
        nome: "Os Liminares", 
        lore: "Pessoas que caíram nas frestas do mundo (como O Avesso ou O Limiar) e conseguiram voltar, mas seus corpos mudaram.", 
        tracos: [
            "Físico Incompleto: O corpo deles não é mais 100% físico."
        ] 
    }
];

const ocupacoes = [
    { 
        id: 'o1', 
        nome: "Criador de Mídias / Analista de Símbolos", 
        desc: "Especialistas em edição e análise de padrões. Perícias Fixas: Tecnologia e Redes, Linguística, Investigação de Campo.", 
        abs: "Edição de vídeo/áudio e recuperação de arquivos digitais corrompidos de fontes mundanas.", 
        maxSkills: 4 
    },
    { 
        id: 'o2', 
        nome: "Herborista / Botânico Semântico", 
        desc: "Especialistas em plantas e infusões para efeitos práticos. Perícias Fixas: Medicina de Emergência, Sobrevivência, Ciências Ocultas.", 
        abs: "Identificar propriedades de plantas e preparar extratos, tinturas ou óleos para relaxamento e primeiros socorros.", 
        maxSkills: 4 
    },
    { 
        id: 'o3', 
        nome: "Antropólogo / Linguista", 
        desc: "Estudiosos do comportamento e das línguas antigas. Perícias Fixas: Linguística, História e Religião, Persuasão.", 
        abs: "Compreensão e tradução imediata de dialetos humanos mortos, gírias locais e isolamento de sotaques regionais.", 
        maxSkills: 4 
    },
    { 
        id: 'o4', 
        nome: "Parapsicólogo", 
        desc: "Pesquisadores de fenômenos anômalos. Perícias Fixas: Investigação de Campo, Tecnologia e Redes, Ciências Ocultas.", 
        abs: "Isolar fraudes e identificar imediatamente vestígios magnéticos ou térmicos anômalos.", 
        maxSkills: 4 
    },
    { 
        id: 'o5', 
        nome: "Estrategista", 
        desc: "Mentes voltadas para a lógica e previsão. Perícias Fixas: Criptografia e Códigos, Intuição, Resistência Mental.", 
        abs: "Análise de probabilidade pura, memorização de padrões estritos e antecipação de movimentos lógicos.", 
        maxSkills: 4 
    },
    { 
        id: 'o6', 
        nome: "Detetive Particular", 
        desc: "Investigadores calejados das ruas. Perícias Fixas: Investigação de Campo, Percepção Espacial, Intuição.", 
        abs: "Encontrar pistas físicas ocultas, fundos falsos e sinais de arrombamento em cenas de crime mundanas.", 
        maxSkills: 4 
    }
];

const constelacoes = [
    { id: 'c1', nome: "Kritérion, O Peso Nulo", frase: "Toda ação exige um preço.", cor: "#2c3e50" },
    { id: 'c2', nome: "Senhor das Cartas Marcadas", frase: "A banca sempre vence no final.", cor: "#c0392b" },
    { id: 'c3', nome: "Senhor das Páginas Ocultas", frase: "O que é dito não é o que é real.", cor: "#27ae60" },
    { id: 'c4', nome: "Dama do Véu Estrelado", frase: "O tempo não é linear.", cor: "#8e44ad" },
    { id: 'c5', nome: "O Escultor da Carne (Plástis)", frase: "A biologia em seu estado mais violento.", cor: "#d35400" },
    { id: 'c6', nome: "O Coração Despedaçado", frase: "A dor é a única arte real.", cor: "#c2185b" }
];

const caminhos = [
    { id: 'cam1', nome: "Caminho do Cavalheiro", lore: "A vontade é a única física reconhecida. Especialistas em vitalidade e em proteger os aliados do absurdo.", diff: "Baixa", estilo: "Tanque e Proteção" },
    { id: 'cam2', nome: "Caminho da Fortuna", lore: "A Roda não possui memória. Manipulam o destino, transformando a pior sorte em vantagens místicas.", diff: "Média", estilo: "Suporte e Probabilidade" },
    { id: 'cam3', nome: "Caminho do Pioneiro", lore: "Os primeiros a pisar no escuro. Batedores que abrem rotas e guiam o grupo através do caos.", diff: "Baixa", estilo: "Vanguarda e Exploração" },
    { id: 'cam4', nome: "Caminho do Louco", lore: "Abraçam a perda de controle. Transformam a insanidade em poder e imprevisibilidade absoluta.", diff: "Alta", estilo: "Caos e Imprevisibilidade" },
    { id: 'cam5', nome: "Caminho do Mago", lore: "A realidade é uma mentira bem contada. Eles escolhem ser os narradores através de conceitos.", diff: "Alta", estilo: "Controle da Realidade" },
    { id: 'cam6', nome: "Caminho da Sacerdotisa", lore: "Para ouvir o cosmos, primeiro é preciso calar o mundo. Especialistas em furtividade e intuição.", diff: "Média", estilo: "Furtividade e Revelação" },
    { id: 'cam7', nome: "Caminho da Imperatriz", lore: "A névoa obedece a quem dita as ordens. Lideram através de comandos soberanos e domínios territoriais.", diff: "Média", estilo: "Liderança e Controle" },
    { id: 'cam8', nome: "Caminho do Imperador", lore: "O Avesso exige uma jaula. Imobilizam ameaças e reforçam as regras da física com correntes de ferro.", diff: "Média", estilo: "Contenção e Defesa" },
    { id: 'cam9', nome: "Caminho do Estudioso", lore: "A loucura obedece a uma sintaxe. Compreendem a gramática do Absurdo para anular seus efeitos.", diff: "Alta", estilo: "Investigação e Tática" },
    { id: 'cam10', nome: "Caminho do Romance", lore: "O poder do vínculo verdadeiro. Compartilham dores, bônus e proteção mútua com um Par escolhido.", diff: "Média", estilo: "Sinergia e Suporte Focado" },
    { id: 'cam11', nome: "Caminho do Carro", lore: "Velocidade e força bruta. Quebram as barreiras dimensionais através da inércia imparável.", diff: "Baixa", estilo: "Mobilidade e Investida" },
    { id: 'cam12', nome: "Caminho da Força", lore: "Transformam a dor em resistência implacável, subjugando as monstruosidades puramente na força física.", diff: "Baixa", estilo: "Combate Corpo-a-Corpo" },
    { id: 'cam13', nome: "Caminho do Eremita", lore: "Isolamento estratégico. A única luz que importa é a da própria mente e lanterna contra a escuridão.", diff: "Média", estilo: "Sobrevivência e Luz" },
    { id: 'cam14', nome: "Caminho da Justiça", lore: "Punição implacável às violações lógicas. Medem o crime das anomalias de existirem fora da Realidade.", diff: "Média", estilo: "Retaliação e Punição" },
    { id: 'cam15', nome: "Caminho do Enforcado", lore: "Invertem a perspectiva e abraçam o martírio, absorvendo traumas para enfraquecer e prender o inimigo.", diff: "Alta", estilo: "Sacrifício e Controle" },
    { id: 'cam16', nome: "Caminho da Morte", lore: "A engrenagem que reduz tudo a pó. Especialistas em colocar um ponto final irreversível nas Máscaras.", diff: "Baixa", estilo: "Dano Letal e Necrose" },
    { id: 'cam17', nome: "Caminho da Temperança", lore: "A alquimia da lucidez. Diluem o dano massivo, purificam os ferimentos e estabilizam mentes frágeis.", diff: "Baixa", estilo: "Cura e Purificação" },
    { id: 'cam18', nome: "Caminho do Diabo", lore: "Usam vícios e desejos como coleiras. Subjugam entidades e aliados através da usura e dependência.", diff: "Alta", estilo: "Pactos e Debuffs" },
    { id: 'cam19', nome: "Caminho da Torre", lore: "A destruição como regra. Desestabilizam arquiteturas e colapsam conceitos ao seu redor.", diff: "Média", estilo: "Dano em Área e Caos" },
    { id: 'cam20', nome: "Caminho do Realizador de Sonhos", lore: "Guiados pelo céu noturno. Concretizam aspirações, servindo de farol de esperança para o grupo.", diff: "Média", estilo: "Buffs e Esperança" },
    { id: 'cam21', nome: "Caminho da Lua", lore: "A mestria sobre a ilusão. Usam espelhos, miragens e distorções mentais para enlouquecer o adversário.", diff: "Alta", estilo: "Ilusão e Paranoia" },
    { id: 'cam22', nome: "Caminho do Sol", lore: "O fogo da primeira fornalha. Queimam as sombras e a poluição dimensional com uma luz pura e radiante.", diff: "Baixa", estilo: "Dano Radiante e Purificação" },
    { id: 'cam23', nome: "Caminho do Julgamento", lore: "O som da última trombeta. Ditam sentenças, avaliam a realidade e exigem retaliação automática.", diff: "Média", estilo: "Suporte Agressivo e Vereditos" },
    { id: 'cam24', nome: "Caminho do Mundo", lore: "A totalidade da obra perfeita. Unificam o espaço, ignoram terrenos difíceis e impõem harmonia geométrica.", diff: "Alta", estilo: "Controle de Terreno e Harmonia" }
];

// ===============================================
// LÓGICA DE NAVEGAÇÃO
// ===============================================
function updateWizard() {
    // 1. Esconde TODAS as etapas
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));

    // 2. Mostra a etapa atual
    const etapaAtual = document.getElementById(`step${currentStep}`);
    if (etapaAtual) {
        etapaAtual.classList.add('active');
    }
    
    // 3. Atualiza Barra de Progresso
    const progresso = (currentStep / totalSteps) * 100;
    document.querySelector('.progress-bar').style.setProperty('--progress-width', `${progresso}%`);

    // 4. Atualiza Título
    document.getElementById('stepTitle').innerText = stepTitles[currentStep - 1];

    // 5. Regras dos botões
    btnPrev.disabled = (currentStep === 1);
    
    if (currentStep === totalSteps) {
        btnNext.innerText = "Concluir";
        gerarResumo(); 
    } else {
        btnNext.innerText = "Próximo Passo";
    }
}

btnNext.addEventListener('click', () => {
    if (currentStep < totalSteps) { currentStep++; updateWizard(); }
});

btnPrev.addEventListener('click', () => {
    if (currentStep > 1) { currentStep--; updateWizard(); }
});

// ===============================================
// FUNÇÕES DE PREENCHIMENTO DE GRIDS
// ===============================================
function criarSelecao(lista, gridId, panelId, updatePanelFn) {
    const grid = document.getElementById(gridId);
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
    document.getElementById('maxSkillsNum').innerText = job.maxSkills;
    maxPermittedSkills = job.maxSkills; 
    limparPericias();
});

criarSelecao(caminhos, 'pathGrid', 'pathDetails', (cam) => {
    document.getElementById('pathName').innerText = cam.nome;
    document.getElementById('pathLore').innerText = cam.lore;
    document.getElementById('pathDiff').innerText = cam.diff;
    document.getElementById('pathStyle').innerText = cam.estilo;
});

const constGrid = document.getElementById('constellationGrid');

// Limpa o grid antes de popular para evitar duplicação se o JS recarregar
if (constGrid) {
    constGrid.innerHTML = ''; 
    constelacoes.forEach(c => {
        const card = document.createElement('div');
        card.className = 'constellation-card';
        card.innerHTML = `
            <div class="constellation-info">
                <h4>${c.nome}</h4>
                <p>${c.frase}</p>
            </div>`;
        
        card.onclick = () => {
            document.querySelectorAll('.constellation-card').forEach(el => el.classList.remove('selected'));
            card.classList.add('selected');
            // Atualiza painel de detalhes
            document.getElementById('constName').innerText = c.nome;
            document.getElementById('constLore').innerText = c.frase; // Aqui você pode expandir para o texto completo
        };
        constGrid.appendChild(card);
    });
}


// ===============================================
// MATEMÁTICA AUTOMÁTICA (ETAPA 3)
// ===============================================
const attrs = document.querySelectorAll('.attr-input');
attrs.forEach(input => input.addEventListener('input', calcularSecundarios));

function calcularSecundarios() {
    const pro = parseInt(document.getElementById('attrProeza').value) || 0;
    const per = parseInt(document.getElementById('attrPercepcao').value) || 0;
    const cog = parseInt(document.getElementById('attrCognicao').value) || 0;
    const inf = parseInt(document.getElementById('attrInfluencia').value) || 0;
    const anc = parseInt(document.getElementById('attrAncora').value) || 0;

    document.getElementById('statVit').innerText = 10 + pro; 
    document.getElementById('statSan').innerText = 10 + anc; 
    document.getElementById('statFlux').innerText = 5 + cog; 
    document.getElementById('statSlots').innerText = 5 + pro; 
}

// ===============================================
// TRAVA DE PERÍCIAS (ETAPA 5)
// ===============================================
const skillCbs = document.querySelectorAll('.skill-cb');

skillCbs.forEach(cb => {
    cb.addEventListener('change', () => {
        const checkedCount = document.querySelectorAll('.skill-cb:checked').length;
        if (checkedCount > maxPermittedSkills) {
            cb.checked = false;
        }
    });
});

function limparPericias() {
    skillCbs.forEach(cb => cb.checked = false);
}

// ===============================================
// RESUMO FINAL (ETAPA 9)
// ===============================================
function gerarResumo() {
    const name = document.getElementById('charName').value || "Desconhecido";
    const racaSelected = document.querySelector('#raceGrid .selected');
    const jobSelected = document.querySelector('#jobGrid .selected');
    const pathSelected = document.querySelector('#pathGrid .selected');

    document.getElementById('finalName').innerText = name;
    document.getElementById('finalRace').innerText = racaSelected ? racaSelected.innerText : "Sem Origem";
    document.getElementById('finalJob').innerText = jobSelected ? jobSelected.innerText : "Desempregado";
    document.getElementById('finalPath').innerText = pathSelected ? pathSelected.innerText : "Sem Caminho";
}

// Inicializa a tela garantindo que a primeira aba e a matemática comecem ativas
updateWizard();
calcularSecundarios();
// ===============================================
// LEITOR DE FOTO DA GALERIA
// ===============================================
const campoArquivo = document.getElementById('charImageFile');
const campoInvisivelTexto = document.getElementById('charImageBase64');
const areaVisualizacao = document.getElementById('imagePreview');

if (campoArquivo) {
    campoArquivo.addEventListener('change', function(event) {
        const fotoSelecionada = event.target.files[0];
        
        if (fotoSelecionada) {
            const leitor = new FileReader();
            
            // Quando o sistema terminar de ler a foto da galeria...
            leitor.onload = function(e) {
                const fotoEmTexto = e.target.result;
                
                // 1. Guarda o texto da foto no campo invisível
                campoInvisivelTexto.value = fotoEmTexto;
                
                // 2. Mostra a fotinha na tela para o jogador ver que funcionou
                areaVisualizacao.innerHTML = `<img src="${fotoEmTexto}" style="max-width: 140px; max-height: 140px; border-radius: 8px; border: 2px solid var(--accent-purple); object-fit: cover; box-shadow: 0 0 10px rgba(122, 27, 156, 0.5);">`;
            };
            
            // Comando que inicia a leitura do arquivo
            leitor.readAsDataURL(fotoSelecionada);
        }
    });
}
