// ===============================================
// SISTEMA DE NAVEGAÇÃO DE ETAPAS E ESTADO
// ===============================================
let currentStep = 1;
const totalSteps = 10;
const TOTAL_ATTR_POINTS = 3;

const stepTitles = [
    "Etapa 1: Identidade",
    "Etapa 2: Raça/Origem",
    "Etapa 3: Atributos",
    "Etapa 4: Ocupação",
    "Etapa 5: Habilidade Inata",
    "Etapa 6: Perícias",
    "Etapa 7: Constelação",
    "Etapa 8: Caminho",
    "Etapa 9: Âncoras",
    "Etapa 10: Finalização"
];

const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');

function updateWizard() {
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));

    const etapaAtual = document.getElementById(`step${currentStep}`);
    if (etapaAtual) etapaAtual.classList.add('active');
    
    const progresso = (currentStep / totalSteps) * 100;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) progressBar.style.setProperty('--progress-width', `${progresso}%`);
    
    const titleEl = document.getElementById('stepTitle');
    if (titleEl) titleEl.innerText = stepTitles[currentStep - 1];

    if (btnPrev) btnPrev.disabled = (currentStep === 1);
    
    if (btnNext) {
        if (currentStep === totalSteps) {
            btnNext.style.display = 'none';
            gerarResumo(); 
        } else {
            btnNext.style.display = 'block';
            btnNext.innerText = "Próximo Passo";
        }
    }
}

function validarEtapaAtual() {
    let valido = true;

    if (currentStep === 1) {
        const inputNome = document.getElementById('charName');
        const nome = inputNome ? inputNome.value.trim() : "";
        if (!nome) {
            alert("Por favor, preencha o nome do personagem para continuar.");
            if (inputNome) {
                inputNome.style.borderColor = "#ff4d4d";
                inputNome.focus();
            }
            valido = false;
        } else if (inputNome) {
            inputNome.style.borderColor = "rgba(255, 255, 255, 0.1)";
        }
    }

    if (currentStep === 3) {
        const pontosUsados = calcularPontosUsados();
        if (pontosUsados > TOTAL_ATTR_POINTS) {
            alert(`Você distribuiu ${pontosUsados} pontos. O máximo permitido é ${TOTAL_ATTR_POINTS}.`);
            valido = false;
        }
    }

    return valido;
}

if (btnNext) {
    btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        if (!validarEtapaAtual()) return;
        if (currentStep < totalSteps) { 
            currentStep++; 
            updateWizard(); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentStep > 1) {
            currentStep--;
            updateWizard();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// ===============================================
// BANCO DE DADOS: O VÉU DO ABSURDO
// ===============================================
const racas = [
  { id: "r1", nome: "Os Cárneos", lore: "A bateria existencial do indivíduo rompeu-se e o corpo parou de produzir a energia biológica que o amarra à realidade. Para não se tornarem cascas vazias, canalizam fluidos e vitalidade de outros seres vivos.", tracos: ["Sem Reflexo: Não projetam imagem clara em espelhos.", "Hematocinese: Manipulam a coagulação do sangue."] },
  { id: "r2", nome: "Os Ferais", lore: "Gerados por traumas absolutos ou surtos instintivos. Diante do horror do Akedonte, a mente consciente recuou, permitindo que a besta interior assumisse o controle.", tracos: ["Predador Perfeito: Visão no escuro e rastreamento emocional.", "Mente Bestial: Imunidade a efeitos mentais simpáticos."] },
  { id: "r3", nome: "Filhos da Falha", lore: "Humanos expostos a Áreas de Ruptura do Absurdo. O código biológico sofreu um erro de leitura da realidade, resultando em mutações que desafiam as leis físicas.", tracos: ["Anomalia Física: Estrutura óssea ou orgânica alterada.", "Distorção de Impacto: Absorvem choques físicos."] },
  { id: "r4", nome: "Os Liminares", lore: "Pessoas que caíram nas frestas conceituais do mundo e retornaram. Parte de sua existência permaneceu do outro lado do Véu.", tracos: ["Físico Incompleto: Roçam a insubstancialidade.", "Ancoragem Instável: Gastam menos Fluxo, sofrem mais estresse."] }
];

const ocupacoes = [
    { id: "o1", nome: "Vidente / Cartomante", abs: "Percepção ou Influência", desc: "Lê a intenção ou o estado emocional de um cliente através de símbolos (tarô, runas). Nunca falha ao notar padrões." },
    { id: "o2", nome: "Parapsicólogo / Pesquisador", abs: "Cognição", desc: "Isola fraudes e truques. Identifica vestígios magnéticos ou térmicos anômalos no ambiente." },
    { id: "o3", nome: "Médium / Espiritista", abs: "Âncora ou Percepção", desc: "Sente flutuações bruscas de ambiente. Nunca entra em pânico ao presenciar manifestações visuais leves." },
    { id: "o4", nome: "Ilusionista de Palco", abs: "Influência", desc: "Especialista em prestidigitação, ocultação de pequenos objetos e detecção de truques de mágica." },
    { id: "o5", nome: "Astrólogo", abs: "Cognição", desc: "Mapeia o tempo simbólico, calcula mapas Astrais complexos e identifica padrões de seitas." },
    { id: "o6", nome: "Criptozoólogo", abs: "Percepção", desc: "Mestre em anatomia comparada exótica. Identifica rastros anômalos na hora." },
    { id: "o7", nome: "Exorcista", abs: "Âncora", desc: "Identifica a autenticidade de objetos sacros e mantém a calma absoluta diante de blasfêmias." },
    { id: "o8", nome: "Detetive Particular", abs: "Percepção", desc: "Encontra pistas físicas ocultas, fundos falsos e sinais de arrombamento em cenas de crime." },
    { id: "o9", nome: "Perito Legista", abs: "Cognição", desc: "Determina a causa exata, hora aproximada e arma utilizada em mortes sem precisar de testes longos." },
    { id: "o10", nome: "Jornalista Investigativo", abs: "Influência", desc: "Encontra fontes anônimas, arranca fofocas institucionais e cruza informações públicas." },
    { id: "o11", nome: "Guarda Florestal / Mateiro", abs: "Percepção", desc: "Possui orientação geográfica perfeita em ambientes selvagens e rastreamento de fauna local." },
    { id: "o12", nome: "Agente de Segurança", abs: "Âncora", desc: "Identifica posturas suspeitas, armas ocultas sob roupas e rotas de evacuação imediata em locais cheios." },
    { id: "o13", nome: "Investigador de Seguros", abs: "Cognição", desc: "Detecta mentiras financeiras, fraudes estruturais e avalia o valor real de bens destruídos." },
    { id: "o14", nome: "Caçador de Recompensas", abs: "Percepção", desc: "Rastreia o paradeiro de alvos urbanos analisando seus hábitos diários, vícios e conexões sociais." },
    { id: "o15", nome: "Estrategista", abs: "Cognição", desc: "Realiza análise de probabilidade pura, memorização de padrões estritos e antecipação de movimentos." },
    { id: "o16", nome: "Filósofo / Historiador da Arte", abs: "Cognição", desc: "Capaz de datar pinturas, identificar correntes filosóficas e decodificar metáforas visuais." },
    { id: "o17", nome: "Antropólogo / Linguista", abs: "Influência ou Cognição", desc: "Compreensão e tradução imediata de dialetos humanos mortos e gírias locais." },
    { id: "o18", nome: "Arquivista / Bibliotecário", abs: "Cognição", desc: "Encontra qualquer documento ou microfilme em acervos caóticos na metade do tempo." },
    { id: "o19", nome: "Arqueólogo", abs: "Percepção", desc: "Avalia a idade, civilização de origem e utilidade prática de artefatos antigos ou ruínas." },
    { id: "o20", nome: "Físico Teórico / Matemático", abs: "Cognição", desc: "Resolve equações mundanas massivas e identifica inconsistências na física clássica de um perímetro." },
    { id: "o21", nome: "Teólogo / Mitólogo", abs: "Cognição", desc: "Reconhece heranças de rituais antigos, panteões esquecidos e dogmas de seitas heréticas." },
    { id: "o22", nome: "Analista de Símbolos", abs: "Cognição ou Influência", desc: "Especialista em edição de vídeo/áudio e recuperação de arquivos digitais corrompidos." },
    { id: "o23", nome: "Hacker / Engenheiro de Software", abs: "Cognição", desc: "Realiza invasão de servidores locais e quebra de criptografias digitais civis." },
    { id: "o24", nome: "Técnico em Radiotransmissão", abs: "Percepção", desc: "Sintoniza frequências raras, isola ruídos em gravações e triangula a origem de sinais." },
    { id: "o25", nome: "Cientista de Dados", abs: "Cognição", desc: "Cruza bancos de dados para encontrar anomalias estatísticas ou picos de comportamento." },
    { id: "o26", nome: "Restaurador / Falsificador", abs: "Percepção", desc: "Identifica instantaneamente se um quadro, documento ou assinatura foi adulterado ou é original." },
    { id: "o27", nome: "Fotógrafo / Operador de Drones", abs: "Percepção", desc: "Captura detalhes milimétricos em imagens e mapeia perímetros aéreos usando lentes especiais." },
    { id: "o28", nome: "Serralheiro / Engenheiro Mecânico", abs: "Cognição", desc: "Desmantela trancas mecânicas comuns, abre cadeados e repara motores ou fiação exposta." },
    { id: "o29", nome: "Terapeuta de Trauma", abs: "Influência ou Âncora", desc: "Desescala crises de pânico e guia conversas de estabilização mental de aliados." },
    { id: "o30", nome: "Herborista / Botânico Semântico", abs: "Percepção ou Cognição", desc: "Identifica propriedades de plantas e prepara extratos para relaxamento e primeiros socorros." },
    { id: "o31", nome: "Paramédico / Socorrista", abs: "Âncora", desc: "Estanca sangramentos críticos, realiza RCP e mantém um ferido grave vivo até o hospital." },
    { id: "o32", nome: "Barman / Sommelier", abs: "Influência", desc: "Lê o humor de clientes, mistura substâncias discretamente e identifica venenos pelo cheiro." },
    { id: "o33", nome: "Motorista Urbano / Taxista", abs: "Percepção", desc: "Conhece rotas alternativas sem depender de GPS. Nunca sofre penalidade ao dirigir sob estresse." },
    { id: "o34", nome: "Ator / Mestre do Disfarce", abs: "Influência", desc: "Muda a entonação de voz, postura e usa maquiagem para se passar por outra pessoa." },
    { id: "o35", nome: "Mestre de Obras", abs: "Âncora", desc: "Avalia a integridade de tetos e vigas. Sabe exatamente se um teto velho corre risco iminente de desabar." }
];

const habilidadesInatas = [
    { id: "i1", nome: "O Paradoxo de Aquiles", desc: "Insere o conceito de 'infinidade' entre seu corpo e a ameaça. Qualquer ataque corpo a corpo perde velocidade infinitamente antes de tocá-lo." },
    { id: "i2", nome: "Dobra Geométrica", desc: "Dobra o espaço entre duas paredes. Um soco desferido no ar acerta um inimigo do outro lado da sala, ignorando cobertura." },
    { id: "i3", nome: "Fresta no Tempo", desc: "Permite agir duas vezes em um turno 'pegando emprestada' uma ação do seu futuro. No próximo turno, perde a ação principal." },
    { id: "i4", nome: "Prisão de Sonho", desc: "Força um alvo a vivenciar as Leis da Física do Akedonte. O inimigo fica paralisado, mas você sofre dano mental enquanto mantiver o link." },
    { id: "i5", nome: "Horizontes Estilhaçados", desc: "Transforma a gravidade de uma sala em algo não-euclidiano. Inimigos rolam testes físicos com Desvantagem." },
    { id: "i6", nome: "Névoa Carmesim", desc: "Transforma seu próprio corpo em névoa escarlate. Ataques físicos atravessam sem causar dano." },
    { id: "i7", nome: "Adaptação Reativa", desc: "Sempre que sofre dano de uma fonte mística, ganha resistência parcial contra aquele conceito no resto da cena." },
    { id: "i8", nome: "Rejeição Celular", desc: "Força seu corpo a ejetar venenos e estilhaços. Restaura Vitalidade, mas avança o Relógio de Sombra em 1 Tique." },
    { id: "i9", nome: "Metabolismo Devorador", desc: "Ao matar uma Máscara, você pode consumir seus restos para restaurar Sanidade e ganhar uma mutação temporária." },
    { id: "i10", nome: "Sangue Fervente", desc: "Queima pontos máximos de Sanidade para ganhar dados extras em rolagens físicas, ultrapassando o limite." },
    { id: "i11", nome: "Contrato de Talião", desc: "Impõe uma regra falada no ambiente. Quem quebrar a regra sofre dano de Sanidade massivo, sem defesa." },
    { id: "i12", nome: "Equação Cármica", desc: "Guarda todo dano sofrido em uma reserva. O seu próximo ataque devolve exatamente o mesmo valor ao agressor." },
    { id: "i13", nome: "Veto Existencial", desc: "Cancela instantaneamente a ação de um monstro, afirmando que ela 'não é logicamente possível'." },
    { id: "i14", nome: "Peso Zero", desc: "Um ataque que acerta o inimigo não causa dano na hora; o impacto e a dor acumulam e são liberados apenas 2 rodadas depois." },
    { id: "i15", nome: "Campo de Igualdade", desc: "Dentro de um raio curto, todas as Vantagens e Desvantagens de aliados e inimigos são anuladas." },
    { id: "i16", nome: "Plágio", desc: "Permite copiar a Habilidade Inerente de outro investigador temporariamente." },
    { id: "i17", nome: "Censura Verbal", desc: "Usando Linguística, profere um verbo de ação. O alvo deve resistir ou o efeito se materializa." },
    { id: "i18", nome: "Reescrita de Identidade", desc: "Ao tocar em um alvo, troca o conceito de 'aliado' e 'inimigo' na cabeça dele por uma rodada." },
    { id: "i19", nome: "Nota de Rodapé", desc: "Marca objetos com símbolos invisíveis. Pode se teleportar para esse local gastando Fluxo." },
    { id: "i20", nome: "Glossário de Fraquezas", desc: "Após observar um inimigo, 'nomeia' uma fraqueza que não existia, tornando-a real para o próximo ataque." },
    { id: "i21", nome: "Fantoche de Engano", desc: "Troca a posição de duas coisas no espaço instantaneamente através de estalos, contanto que possuam peso equivalente." },
    { id: "i22", nome: "Dado Viciado", desc: "Força uma Desvantagem automática antes de rolar dados. Se passar no teste, o efeito vira um acerto crítico brutal." },
    { id: "i23", nome: "Roleta", desc: "Toda vez que ataca, tem 50% de chance de causar o dobro de dano, e 50% de tomar o próprio dano." },
    { id: "i24", nome: "Aposta do Idiota", desc: "Declara ao Mestre que matará um monstro com um golpe. Se acertar, morre. Se falhar, entra em Dissonância." },
    { id: "i25", nome: "Máscara Social", desc: "Permite roubar a aparência e a voz da última Âncora que um alvo se esqueceu." },
    { id: "i26", nome: "Vínculo Empático", desc: "Liga sua mente à do alvo. Todo dano mental que você sofre, o alvo sofre igual." },
    { id: "i27", nome: "Fobia Encarnada", desc: "O inimigo passa a enxergar você como seu 'Predador Natural', sendo incapaz de atacar primeiro." },
    { id: "i28", nome: "Lágrimas Físicas (Cristalização)", desc: "Emoções de medo se transformam em armas físicas cortantes feitas de vidro opaco." },
    { id: "i29", nome: "Projeção de Trauma", desc: "Materializa um 'amigo imaginário' monstruoso. Ele luta por você, exigindo o sacrifício de uma memória." },
    { id: "i30", nome: "Eco de Luto", desc: "Aura passiva que quebra a agressividade. Inimigos precisam gastar esforço triplo para lutar." }
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
    { id: 'cam1', nome: "Caminho do Cavalheiro", descricao: "O sangue não corre por pressão, mas porque eu me recuso a esquecer o Conceito de Estar Vivo.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Retórica Vital, Espada Vorpal.</p><p><strong>2:</strong> Escudo da Memória.</p><p><strong>3:</strong> Controle de Lâminas, O Corte é só um Conceito.</p><p><strong>4:</strong> Postura Inabalável, Minha Espada é minha Companheira.</p><p><strong>5:</strong> Âncora de Almas.</p><p><strong>6:</strong> Imposição de Realidade.</p><p><strong>7:</strong> Sacrifício do Campeão.</p>" },
    { id: 'cam2', nome: "Caminho da Fortuna", descricao: "A Roda não possui memória. Ela não celebra quem está no topo, nem chora por quem caiu ao fundo.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Impulso Entrópico, Um Pouco de Sorte.</p><p><strong>2:</strong> Inversão Polar.</p><p><strong>3:</strong> Triunfo Efêmero.</p><p><strong>4:</strong> Clareza do Abismo, Só Morro por Azar.</p><p><strong>5:</strong> Sincronia Cíclica.</p><p><strong>6:</strong> Trapaça Dimensional.</p><p><strong>7:</strong> Reinicialização do Destino, Benção da Roda.</p>" },
    { id: 'cam3', nome: "Caminho do Pioneiro", descricao: "Alguém precisa dar o primeiro passo no escuro para que os outros saibam onde pisar.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Trilha de Fuligem, Recalibrar Foco.</p><p><strong>2:</strong> Bússola Semântica.</p><p><strong>3:</strong> Escudo de Vanguarda.</p><p><strong>4:</strong> Rota de Fuga Crítica.</p><p><strong>5:</strong> Acampamento Conceitual.</p><p><strong>6:</strong> Arrombamento da Membrana.</p><p><strong>7:</strong> Conquista Territorial.</p>" },
    { id: 'cam4', nome: "Caminho do Louco", descricao: "Vocês chamam de perda de controle. Eu chamo de parar de fingir que as paredes são de concreto.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Ignorância Sagrada.</p><p><strong>2:</strong> Sorte dos Desesperados.</p><p><strong>3:</strong> Imprevisibilidade Absoluta.</p><p><strong>4:</strong> Milagre Cacofônico.</p><p><strong>5:</strong> Palavra Absurda.</p><p><strong>6:</strong> Êxtase de Sombra.</p><p><strong>7:</strong> Mentira Cósmica.</p>" },
    { id: 'cam5', nome: "Caminho do Mago", descricao: "Se a realidade mundana é uma mentira bem contada, eu escolho ser o narrador.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Vontade Concreta.</p><p><strong>2:</strong> Alquimia Verbal, Mestre das Palavras.</p><p><strong>3:</strong> Elo Espiritual.</p><p><strong>4:</strong> Projeção Sintática, Minha Palavra tem Poder.</p><p><strong>5:</strong> Substituição Axiomática.</p><p><strong>6:</strong> Redescrição Semântica.</p><p><strong>7:</strong> Decreto Primordial, Sapiência Concorrente.</p>" },
    { id: 'cam6', nome: "Caminho da Sacerdotisa", descricao: "A verdade não grita; ela sussurra. Para ouvir o cosmos, você precisa calar o mundo.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Intuição Velada, Aura de Cura, Detecção de Mentiras.</p><p><strong>2:</strong> Ocultamento.</p><p><strong>3:</strong> Psicometria Hermética.</p><p><strong>4:</strong> Reflexo do Avesso, Guardar Segredo.</p><p><strong>5:</strong> Santuário Enclausurado.</p><p><strong>6:</strong> Selo da Membrana.</p><p><strong>7:</strong> Censura Cósmica.</p>" },
    { id: 'cam7', nome: "Caminho da Imperatriz", descricao: "A névoa obedece a quem dita as ordens. O Avesso pode ser um monarca caótico, mas eu sou a dona do berço.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Concepção Espontânea, Onisciência de uma Imperatriz.</p><p><strong>2:</strong> Majestade Opressora, Eu Ordeno.</p><p><strong>3:</strong> Proliferação do Verbo.</p><p><strong>4:</strong> Parto do Absurdo, Transformação em Névoa.</p><p><strong>5:</strong> Domínio Territorial.</p><p><strong>6:</strong> Nutrição Sombria, Meus Súditos.</p><p><strong>7:</strong> Gênese Soberana, Eu sou a Única Rainha aqui.</p>" },
    { id: 'cam8', nome: "Caminho do Imperador", descricao: "O Caos exige um nome; o Avesso exige uma jaula. Eu reforçarei os pregos.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Estrutura de Contenção, Cetro do Rei.</p><p><strong>2:</strong> Grilhões de Linha.</p><p><strong>3:</strong> Autoridade de Vanguarda.</p><p><strong>4:</strong> Blindagem Autocrática, Olhem para Mim.</p><p><strong>5:</strong> Supressão de Mito.</p><p><strong>6:</strong> Intervenção, Recusa.</p><p><strong>7:</strong> Lei Marcial Cósmica.</p>" },
    { id: 'cam9', nome: "Caminho do Estudioso", descricao: "O Avesso não é o caos; é uma língua cuja gramática vocês se recusam a estudar.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Lição Compartilhada, Estudioso Sem Fundo.</p><p><strong>2:</strong> Tese Ortodoxa, Forçando o Conhecimento.</p><p><strong>3:</strong> Escolástica Protetora, Novos Saberes.</p><p><strong>4:</strong> Epifania Herética, A Loucura também é Sã.</p><p><strong>5:</strong> Hermenêutica da Máscara.</p><p><strong>6:</strong> Precedente Semântico.</p><p><strong>7:</strong> Enciclopédia do Oco.</p>" },
    { id: 'cam10', nome: "Caminho do Romance", descricao: "A engrenagem quer nos isolar. Mas enquanto eu lembrar do seu nome, o Avesso não poderá reescrever o meu.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Almas Gêmeas, Dividir o Fardo.</p><p><strong>2:</strong> O Peso da Escolha, Troca de Lugar.</p><p><strong>3:</strong> Ressonância Vital, A Força do Amor.</p><p><strong>4:</strong> Ciúmes, Obsessão.</p><p><strong>5:</strong> Ação Conjugada, Fusão.</p><p><strong>6:</strong> Ruptura de Elo.</p><p><strong>7:</strong> Devotamento Absoluto.</p>" },
    { id: 'cam11', nome: "Caminho do Carro", descricao: "Se não há estrada através do Abismo, nós abriremos uma na marreta e na velocidade.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Vetor Inabalável.</p><p><strong>2:</strong> Tração Concorrente, Positivo e Negativo.</p><p><strong>3:</strong> Impacto Cinético, Eu sou uma Máquina.</p><p><strong>4:</strong> Avanço Cego.</p><p><strong>5:</strong> Comboio de Almas.</p><p><strong>6:</strong> Forçar Passagem.</p><p><strong>7:</strong> Carga Absoluta.</p>" },
    { id: 'cam12', nome: "Caminho da Força", descricao: "Eles acham que são os predadores desta cidade, mas esqueceram quem inventou as correntes.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Dor Convertida, Vigor Firme.</p><p><strong>2:</strong> Tolerância Industrial, Minha Mente também é Forte.</p><p><strong>3:</strong> Submissão Semântica.</p><p><strong>4:</strong> Predador do Beco.</p><p><strong>5:</strong> Aura Indomável, Aura de Respeito.</p><p><strong>6:</strong> Amarra de Carne e Verbo.</p><p><strong>7:</strong> Dominação Absoluta, Eu sou a Guerra e o Sangue.</p>" },
    { id: 'cam13', nome: "Caminho do Eremita", descricao: "No fundo do Abismo, a única luz que importa é aquela que você acende dentro da sua própria mente.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Lanterna de Querosene, Claridade Solitária, Lanterna Espanta Males.</p><p><strong>2:</strong> Isolamento Semântico.</p><p><strong>3:</strong> Dissipar a Névoa, Atrair / Cegar.</p><p><strong>4:</strong> Cérebro de Pedra, Substituição.</p><p><strong>5:</strong> Paciência do Monge.</p><p><strong>6:</strong> Farol da Vanguarda.</p><p><strong>7:</strong> Clausura Absoluta.</p>" },
    { id: 'cam14', nome: "Caminho da Justiça", descricao: "Minha balança não mede ouro; ela mede o crime de existir fora da Realidade.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Lei da Reciprocidade, Sem Mentiras.</p><p><strong>2:</strong> Olho por Olho.</p><p><strong>3:</strong> Veredito de Contenção, Ferramentas Jurídicas.</p><p><strong>4:</strong> Cegueira Judicial.</p><p><strong>5:</strong> Cláusula de Retaliação, Tribunal.</p><p><strong>6:</strong> Fiança, No Caminho Certo.</p><p><strong>7:</strong> Sentença Executória, Eu sou a Justiça.</p>" },
    { id: 'cam15', nome: "Caminho do Enforcado", descricao: "Quando você aceita o peso da corda, percebe que o chão é apenas o teto de um abismo maior.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Claridade Estática, A Verdade está no Sofrimento.</p><p><strong>2:</strong> Martírio Substitutivo.</p><p><strong>3:</strong> Aura de Chumbo, O Pendurado.</p><p><strong>4:</strong> Visão do Outro Lado.</p><p><strong>5:</strong> Armadilha de Cânhamo.</p><p><strong>6:</strong> Marionetes Místicas, Ponto de Vista.</p><p><strong>7:</strong> Sacrifício do Redentor, O Enforcado.</p>" },
    { id: 'cam16', nome: "Caminho da Morte", descricao: "A engrenagem mais perfeita de todas é aquela que reduz tudo ao pó.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Toque de Ocaso, A Morte Chega para Todos.</p><p><strong>2:</strong> Colheita, Foice de Tanatus.</p><p><strong>3:</strong> Necrose, Corpo de Sombras.</p><p><strong>4:</strong> Necrotório.</p><p><strong>5:</strong> Amputação, Controle de Mortalidade.</p><p><strong>6:</strong> Sentença de Finitude.</p><p><strong>7:</strong> Decreto de Extinção, Corpo da Morte.</p>" },
    { id: 'cam17', nome: "Caminho da Temperança", descricao: "Até o pior dos ácidos pode ser neutralizado se souber despejar lucidez na mistura.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Filtro Alquímico, Corpo Maleável.</p><p><strong>2:</strong> Diluição Simbólica, Investigando Componentes.</p><p><strong>3:</strong> Transmutação Reativa, Tramitação de Energias.</p><p><strong>4:</strong> Escoamento Psíquico, Controlador de Fórmulas.</p><p><strong>5:</strong> Harmonização das Fontes.</p><p><strong>6:</strong> Retardo Volumétrico, Local Seguro.</p><p><strong>7:</strong> Ascensão Impura, Diluição Absoluta.</p>" },
    { id: 'cam18', nome: "Caminho do Diabo", descricao: "Eu prefiro usar o ouro e a carne como coleira para os monstros da névoa.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Moeda de Troca, Aspecto Demoníaco.</p><p><strong>2:</strong> Percepção de Vícios, Vínculo Obsessivo, Pacto.</p><p><strong>3:</strong> Contrato Leonino, Atacar pelas Costas.</p><p><strong>4:</strong> Anatomia Possessiva, Diabretes.</p><p><strong>5:</strong> Indução ao Delírio, Indução à Luxúria.</p><p><strong>6:</strong> Suborno.</p><p><strong>7:</strong> Pacto de Subjugação, Encarnação do Desejo.</p>" },
    { id: 'cam19', nome: "Caminho da Torre", descricao: "Eu sou o raio que lembra a esta cidade que tudo o que é sólido foi feito para desabar.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Expulsão de Ruína, Sentido do Caos.</p><p><strong>2:</strong> Choque de Realidade, A Torre.</p><p><strong>3:</strong> Demolição Arquitetônica.</p><p><strong>4:</strong> Mente em Escombros.</p><p><strong>5:</strong> Desconstrução do Verbo.</p><p><strong>6:</strong> Sabotagem, Mergulho no Caos.</p><p><strong>7:</strong> Cataclismo Absoluto.</p>" },
    { id: 'cam20', nome: "Caminho do Realizador de Sonhos", descricao: "Um sonho verdadeiro não precisa de permissão para se tornar real.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Luz Estreante, Centelha de Esperança.</p><p><strong>2:</strong> Alinhamento de Fluidos, Seu Maior Desejo.</p><p><strong>3:</strong> Revelação Sideral, Olhem para Aquilo.</p><p><strong>4:</strong> Mente em Florescência.</p><p><strong>5:</strong> Cúpula Onírica, Cúpula de Proteção.</p><p><strong>6:</strong> Aspiração Impenetrável.</p><p><strong>7:</strong> Utopia Concretizada, O Tecedor de Estrelas.</p>" },
    { id: 'cam21', nome: "Caminho da Lua", descricao: "A névoa apenas mostra o que você mais teme ver.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Fluidez Lunar, Reflexo de Prata.</p><p><strong>2:</strong> Miragem da Membrana.</p><p><strong>3:</strong> Projeção do Subconsciente.</p><p><strong>4:</strong> Mente Lunar, Instabilidade Biológica.</p><p><strong>5:</strong> Alucinação Coletiva.</p><p><strong>6:</strong> Apagão Conceitual.</p><p><strong>7:</strong> Colapso do Reflexo.</p>" },
    { id: 'cam22', nome: "Caminho do Sol", descricao: "Sob a minha luz, até o horror mais profundo é obrigado a projetar uma sombra humana.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Revelação Incandescente, Foco Purificador.</p><p><strong>2:</strong> Farol da Razão.</p><p><strong>3:</strong> Calor Industrial.</p><p><strong>4:</strong> Presença Ofuscante.</p><p><strong>5:</strong> Expulsão do Avesso.</p><p><strong>6:</strong> Combustão Semântica.</p><p><strong>7:</strong> Supernova Conceitual.</p>" },
    { id: 'cam23', nome: "Caminho do Julgamento", descricao: "O som da trombeta ecoa de dentro do peito daqueles que decidiram acordar.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Veredito Prévio, Apelo da Consciência.</p><p><strong>2:</strong> Retribuição Axiomática.</p><p><strong>3:</strong> Vocação Desperta.</p><p><strong>4:</strong> Tribunal da Mente.</p><p><strong>5:</strong> Ressurreição Semântica.</p><p><strong>6:</strong> Balança Final.</p><p><strong>7:</strong> Apocalipse das Máscaras.</p>" },
    { id: 'cam24', nome: "Caminho do Mundo", descricao: "A Realidade não é uma colcha de retalhos, mas uma obra perfeita. E eu seguro a caneta.", habilidades: "<h4>Graus</h4><p><strong>1:</strong> Passo Cosmopolita, Conexão Telúrica.</p><p><strong>2:</strong> Expansão de Espaço.</p><p><strong>3:</strong> Totalidade de Saberes.</p><p><strong>4:</strong> Unidade com o Todo.</p><p><strong>5:</strong> Geometria Perfeita.</p><p><strong>6:</strong> Harmonia Absoluta.</p><p><strong>7:</strong> Conclusão da Jornada.</p>" }
];

// ===============================================
// SELEÇÃO DE GRIDS E EVENTOS
// ===============================================
function criarSelecao(lista, gridId, panelId, updatePanelFn) {
    const grid = document.getElementById(gridId);
    if (!grid || !Array.isArray(lista)) return;
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

criarSelecao(habilidadesInatas, 'innateGrid', 'innateDetails', (hab) => {
    document.getElementById('innateName').innerText = hab.nome;
    document.getElementById('innateDesc').innerText = hab.desc;
});

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
// CÁLCULO DE ATRIBUTOS E DERIVADOS
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
    const pro = parseInt(document.getElementById('attrProeza')?.value) || 1;
    const cog = parseInt(document.getElementById('attrCognicao')?.value) || 1;
    const anc = parseInt(document.getElementById('attrAncora')?.value) || 1;
    const grau = 1;

    const vit = 10 + (pro * 5);
    const san = 10 + (anc * 5);
    const flux = 3 + grau + anc;
    const slots = 3 + pro;
    const maxSkills = 2 + cog;

    if (document.getElementById('statVit')) document.getElementById('statVit').innerText = vit; 
    if (document.getElementById('statSan')) document.getElementById('statSan').innerText = san; 
    if (document.getElementById('statFlux')) document.getElementById('statFlux').innerText = flux; 
    if (document.getElementById('statSlots')) document.getElementById('statSlots').innerText = slots;
    
    const maxSkillsSpan = document.getElementById('maxSkillsNum');
    if (maxSkillsSpan) maxSkillsSpan.innerText = maxSkills;
    
    atualizarTravaPericias(maxSkills);
}

// ===============================================
// PERÍCIAS
// ===============================================
function atualizarTravaPericias(maxPermitido) {
    const skillCbs = document.querySelectorAll('.skill-cb');
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
                if (campoInvisivelTexto) campoInvisivelTexto.value = e.target.result;
                if (areaVisualizacao) areaVisualizacao.innerHTML = `<img src="${e.target.result}" style="max-width:120px; max-height:120px; border-radius:8px; border:2px solid var(--accent-purple);">`;
            };
            leitor.readAsDataURL(foto);
        }
    });
}

// ===============================================
// RESUMO FINAL E EXPORTAÇÃO
// ===============================================
function gerarResumo() {
    const nome = document.getElementById('charName')?.value || "Desconhecido";
    const racaSelected = document.querySelector('#raceGrid .selected');
    const jobSelected = document.querySelector('#jobGrid .selected');
    const innateSelected = document.querySelector('#innateGrid .selected');
    const pathSelected = document.querySelector('#pathGrid .selected');
    const constSelected = document.querySelector('.constellation-card.selected h4');
    const imgBase64 = document.getElementById('charImageBase64')?.value;

    if (document.getElementById('finalName')) document.getElementById('finalName').innerText = nome;
    if (document.getElementById('finalRace')) document.getElementById('finalRace').innerText = racaSelected ? racaSelected.innerText : "Sem Origem";
    if (document.getElementById('finalJob')) document.getElementById('finalJob').innerText = jobSelected ? jobSelected.innerText : "Sem Ocupação";
    if (document.getElementById('finalPath')) document.getElementById('finalPath').innerText = pathSelected ? pathSelected.innerText : "Sem Caminho";

    const previewContainer = document.getElementById('summaryPreview');
    if (imgBase64 && previewContainer) {
        previewContainer.innerHTML = `<img src="${imgBase64}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-purple);">`;
    }

    const pericias = Array.from(document.querySelectorAll('.skill-cb:checked')).map(cb => cb.value);

    const summaryDetails = document.getElementById('summaryDetails');
    if (summaryDetails) {
        summaryDetails.innerHTML = `
            <p><strong>Vitalidade:</strong> ${document.getElementById('statVit')?.innerText || 15} | <strong>Sanidade:</strong> ${document.getElementById('statSan')?.innerText || 15} | <strong>Fluxo:</strong> ${document.getElementById('statFlux')?.innerText || 5}</p>
            <p><strong>Habilidade Inata:</strong> ${innateSelected ? innateSelected.innerText : "Nenhuma selecionada"}</p>
            <p><strong>Constelação:</strong> ${constSelected ? constSelected.innerText : "Não selecionada"}</p>
            <p><strong>Perícias Escolhidas:</strong> ${pericias.join(', ') || "Nenhuma"}</p>
            <p><strong>Âncoras:</strong> ${document.getElementById('anchorPerson')?.value || "-"} (Pessoa), ${document.getElementById('anchorPlace')?.value || "-"} (Lugar), ${document.getElementById('anchorObject')?.value || "-"} (Objeto)</p>
        `;
    }
}

window.exportarJSON = function() {
    const nome = document.getElementById('charName')?.value || "personagem";
    const innateSelected = document.querySelector('#innateGrid .selected');
    
    const dados = {
        nome: nome,
        idade: document.getElementById('charAge')?.value,
        pronome: document.getElementById('charPronoun')?.value,
        habilidadeInata: innateSelected ? innateSelected.innerText : "Nenhuma",
        atributos: {
            proeza: document.getElementById('attrProeza')?.value,
            percepcao: document.getElementById('attrPercepcao')?.value,
            cognicao: document.getElementById('attrCognicao')?.value,
            influencia: document.getElementById('attrInfluencia')?.value,
            ancora: document.getElementById('attrAncora')?.value
        },
        stats: {
            vitalidade: document.getElementById('statVit')?.innerText,
            sanidade: document.getElementById('statSan')?.innerText,
            fluxo: document.getElementById('statFlux')?.innerText,
            slots: document.getElementById('statSlots')?.innerText
        },
        ancorasLiterais: {
            pessoa: document.getElementById('anchorPerson')?.value,
            lugar: document.getElementById('anchorPlace')?.value,
            objeto: document.getElementById('anchorObject')?.value
        }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dados, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${nome.toLowerCase().replace(/\s+/g, '_')}_ficha.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
};

window.salvarNovoPersonagem = function() {
    const racaSelected = document.querySelector('#raceGrid .selected');
    const jobSelected = document.querySelector('#jobGrid .selected');
    const innateSelected = document.querySelector('#innateGrid .selected');
    const pathSelected = document.querySelector('#pathGrid .selected');
    
    const imgInput = document.getElementById('charImageBase64')?.value;
    const imagemFinal = imgInput ? imgInput : "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";

    const novoPersonagem = {
        id: Date.now(),
        nome: document.getElementById('charName')?.value || "Desconhecido",
        imagem: imagemFinal,
        conceito: (racaSelected ? racaSelected.innerText : "Sem Origem") + " | " + (pathSelected ? pathSelected.innerText : "Sem Caminho"),
        grau: 1, 
        ocupacao: jobSelected ? jobSelected.innerText : "Sem Ocupação",
        habilidadeInata: innateSelected ? innateSelected.innerText : "Nenhuma habilidade inata selecionada.", 
        vitalidade: parseInt(document.getElementById('statVit')?.innerText) || 15,
        sanidade: parseInt(document.getElementById('statSan')?.innerText) || 15,
        fluxo: parseInt(document.getElementById('statFlux')?.innerText) || 10,
        estresse: 0,
        atributos: {
            proeza: document.getElementById('attrProeza')?.value || 1,
            percepcao: document.getElementById('attrPercepcao')?.value || 1,
            cognicao: document.getElementById('attrCognicao')?.value || 1,
            influencia: document.getElementById('attrInfluencia')?.value || 1,
            ancora: document.getElementById('attrAncora')?.value || 1
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