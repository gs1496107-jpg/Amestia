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
  {
    id: "r1",
    nome: "Os Cárneos",
    lore: "A bateria existencial do indivíduo rompeu-se e o corpo parou de produzir a energia biológica que o amarra à realidade. Para não se tornarem cascas vazias, canalizam fluidos e vitalidade de outros seres vivos.",
    tracos: [
      "Sem Reflexo: Não projetam imagem clara em espelhos ou gravações.",
      "Hematocinese: Manipulam a coagulação e o fluxo do próprio sangue para combate ou estancamento.",
      "Presença Inerte: Ignoram efeitos ambientais de frio extremo e parada cardíaca por curtos períodos."
    ]
  },
  {
    id: "r2",
    nome: "Os Ferais",
    lore: "Gerados por traumas absolutos ou surtos instintivos de sobrevivência. Diante do horror do Akedonte, a mente consciente recuou, permitindo que a besta interior assumisse o controle para preservar a vida.",
    tracos: [
      "Predador Perfeito: Possuem visão no escuro e rastreamento por odores emocionais (medo, sangue).",
      "Mente Bestial: Imunidade a efeitos mentais que exijam empatia ou persuasão humana.",
      "Garras Inatas: Capazes de desferir ataques corporais cortantes sem o uso de armas."
    ]
  },
  {
    id: "r3",
    nome: "Filhos da Falha",
    lore: "Humanos expostos a Áreas de Ruptura ou anomalias do Absurdo. O código biológico sofreu um erro de leitura da realidade, resultando em mutações que desafiam as leis físicas.",
    tracos: [
      "Anomalia Física: Estrutura óssea ou orgânica alterada (membros extras, pele endurecida).",
      "Inumanos: Reações atípicas a medicamentos e rituais; imunidade a certas fobias místicas.",
      "Distorção de Impacto: Absorvem choques físicos alterando a densidade corpórea local."
    ]
  },
  {
    id: "r4",
    nome: "Os Liminares",
    lore: "Pessoas que caíram nas frestas conceituais do mundo e retornaram. Parte de sua existência permaneceu do outro lado do Véu, fazendo com que a realidade por vezes não aplique leis físicas sobre eles.",
    tracos: [
      "Físico Incompleto: Atravessam obstáculos estreitos ou roçam a insubstancialidade por breves instantes.",
      "Eco Espacial: Dificuldade extrema de serem rastreados por meios convencionais ou câmeras.",
      "Ancoragem Instável: Gastam menos Fluxo para interagir com o Akedonte, mas sofrem mais estresse mental."
    ]
  }
];

const ocupacoes = [
  {
    id: "o1",
    nome: "Vidente / Cartomante",
    atributoChave: "Percepção ou Influência",
    habilidade: "Lê a intenção imediata de pessoas através de símbolos e identifica coincidências não-naturais em investigações."
  },
  {
    id: "o2",
    nome: "Parapsicólogo",
    atributoChave: "Cognição",
    habilidade: "Isola fraudes instantaneamente e identifica vestígios eletromagnéticos ou anomalias conceituais no ambiente."
  },
  {
    id: "o3",
    nome: "Médium / Espiritista",
    atributoChave: "Âncora ou Percepção",
    habilidade: "Sente flutuações e presença de entidades no ambiente, mantendo imunidade a surtos leves de pânico místico."
  },
  {
    id: "o4",
    nome: "Detetive Particular",
    atributoChave: "Percepção",
    habilidade: "Encontra pistas físicas ocultas, sinais de arrombamento e reconhece mentiras por linguagem corporal."
  },
  {
    id: "o5",
    nome: "Paramédico / Socorrista",
    atributoChave: "Âncora ou Proeza",
    habilidade: "Estanca sangramentos graves rapidamente, estabiliza feridos críticos e ignora penalidades por trauma visual."
  },
  {
    id: "o6",
    nome: "Hacker / Eng. Software",
    atributoChave: "Cognição",
    habilidade: "Invade servidores civis, quebra criptografias e rastreia pegadas digitais em redes restritas."
  },
  {
    id: "o7",
    nome: "Arquivista / Bibliotecário",
    atributoChave: "Cognição",
    habilidade: "Localiza informações históricas ocultas ou proibidas em tempo recorde e traduz trechos de idiomas mortos."
  },
  {
    id: "o8",
    nome: "Policial / Agente de Campo",
    atributoChave: "Proeza ou Percepção",
    habilidade: "Acessa protocolos de autoridade, possui uso eficiente de armas de fogo e conhecimento de balística avançada."
  },
  {
    id: "o9",
    nome: "Médico Legista / Patologista",
    atributoChave: "Cognição ou Percepção",
    habilidade: "Determina causa exata da morte, horário e presença de toxinas ou substâncias anômalas sem testes demorados."
  },
  {
    id: "o10",
    nome: "Criminoso / Receptador",
    atributoChave: "Proeza ou Influência",
    habilidade: "Arromba fechaduras convencionais, avalia o valor real de itens roubados e transita no submundo sem chamar atenção."
  },
  {
    id: "o11",
    nome: "Jornalista de Investigação",
    atributoChave: "Influência ou Percepção",
    habilidade: "Extrai segredos de testemunhas relutantes através de entrevistas e identifica rotas de encobrimento na mídia."
  },
  {
    id: "o12",
    nome: "Coveiro / Agente Funerário",
    atributoChave: "Âncora ou Proeza",
    habilidade: "Possui resistência natural a odores de decomposição e facilidade em identificar rituais de sepultamento profanados."
  },
  {
    id: "o13",
    nome: "Exorcista / Sacerdote",
    atributoChave: "Âncora",
    habilidade: "Mantém a calma sob opressão espiritual extrema e realiza rituais de banimento contra manifestações menores."
  },
  {
    id: "o14",
    nome: "Artista / Falsificador",
    atributoChave: "Influência ou Cognição",
    habilidade: "Identifica falsificações em documentos e obras, além de criar réplicas precisas de assinaturas e selos oficiais."
  }
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
            <p><strong>Colheita [Ativa - Reação]:</strong> Quando uma Máscara menor for derrotada ou elemento de cenário perigoso for desativado, você absorve o último suspiro da ideia. O próximo aliado a agir recebe Vantagem (+1d20) e ignora coberturas ou camuflagens de névoa. Custo: 2 PF + 1d4 pontos de Sanidade.</p>
            <p><strong>Foice de Tanatus [Ativa]:</strong> Invoca uma foice negra feita de sombras puras. A cada golpe bem-sucedido deferido com esta foice, você recupera 1d4 de vida. Custo: 2 PF.</p>
        `
    },
    {
        id: "temperanca",
        nome: "Caminho da Temperança",
        descricao: '"O Abismo é um ácido que corrói a realidade. Mas até o pior dos ácidos pode ser neutralizado se você souber exatamente quantas gotas de lucidez deve despejar na mistura."',
        habilidades: `
            <h4>Grau 1: O Destilador de Choques</h4>
            <p><strong>Filtro Alquímico [Passiva]:</strong> Ao manifestar o Dado 1, você purifica a reação. Recebe a Verdade Oculta, mas o marcador de Estresse não se instala; vira uma Carga Volátil (use para Vantagem +1d20).</p>
            <p><strong>Corpo Maleável [Passiva]:</strong> Maestria biológica total sobre seu próprio organismo, tornando-o capaz de transferir livremente ferimentos e traumas físicos de um local para outro em seu próprio corpo.</p>
            
            <h4>Grau 2: A Tintura de Calma</h4>
            <p><strong>Diluição Simbólica [Ativa - Reação]:</strong> Ao sofrer (ou um aliado a até 6 metros sofrer) perda drástica de Vitalidade ou Sanidade, divide o dano total igualmente entre você e o alvo original. Custo: 3 PF + 1d4+2 pontos de Sanidade.</p>
            <p><strong>Investigando Componentes [Ativa]:</strong> Revela instantaneamente quais são os ingredientes exatos que compõem fluidos, poções ou misturas líquidas. Custo: 2 PF + 1d6 de sanidade.</p>
        `
    },
    {
        id: "diabo",
        nome: "Caminho do Diabo",
        descricao: '"O Grande Antigo nos deu a carne e o ouro para servirem de distração. Eu prefiro usá-los como coleira para os monstros que habitam a sua névoa."',
        habilidades: `
            <h4>Grau 1: O Agiota de Almas</h4>
            <p><strong>Moeda de Troca [Passiva]:</strong> Ao manifestar o Dado 1, prende o Sussurro em um pacto. Recebe a Verdade Oculta e injeta uma "Dívida de Carne" em uma Máscara de NP 1 ou 2: na próxima rodada, ela perde um dado de Oposição ou sangra.</p>
            <p><strong>Aspecto Demoníaco [Passiva]:</strong> Você manifesta chifres e sua mão esquerda se transforma em uma garra grotesca, capaz de atacar fisicamente como se fosse uma arma média.</p>
            
            <h4>Grau 2: O Carcereiro dos Vícios</h4>
            <p><strong>Percepção de Vícios [Passiva]:</strong> Consegue sentir e identificar com precisão as fixações materiais, desejos mundanos e vícios ocultos de qualquer ser ao seu redor.</p>
            <p><strong>Vínculo Obsessivo [Ativa]:</strong> Manifesta o conceito de "Dependência". O alvo fica obcecado por um objeto inanimado da cena por 2 rodadas. Custo: 2 PF + 1d8 ponto de Sanidade Atual.</p>
            <p><strong>Pacto [Ativa]:</strong> Faz um contrato com um ser de Grau inferior. Você recupera Sanidade e o alvo perde Vida, em troca de pequenos milagres. Custo: 3 PF.</p>
        `
    },
    {
        id: "torre",
        nome: "Caminho da Torre",
        descricao: '"Vocês construíram paredes de tijolos e certezas para esquecer o abismo. Eu sou o raio que lembra a esta cidade que tudo o que é sólido foi feito para desabar."',
        habilidades: `
            <h4>Grau 1: O Detonador de Fuligem</h4>
            <p><strong>Expulsão de Ruína [Passiva]:</strong> Sempre que manifestar o Dado 1, gera detonação de fuligem estilhaçando uma Máscara de NP 1 ou obstáculo próximo, concedendo Vantagem (+1d20) aos aliados.</p>
            <p><strong>Sentido do Caos [Passiva]:</strong> Você prevê quando o Caos está prestes a começar (quando o Relógio de Sombra vai dar seu último tique).</p>
            
            <h4>Grau 2: O Raio de Newgate</h4>
            <p><strong>Choque de Realidade [Ativa]:</strong> Dita um paradoxo a uma Máscara de NP 1 ou 2. Ela fica Atordoada por 1 rodada, perdendo bônus de defesa. Custo: 2 PF + 1d4 de Sanidade Atual.</p>
            <p><strong>A Torre [Ativa]:</strong> Manifesta a estrutura de uma Torre espiritual que força todos os presentes na cena a realizarem um teste de Proeza para não ficarem paralisados. Custo: 3 PF.</p>
        `
    },
    {
        id: "sonhos",
        nome: "Caminho do Realizador de Sonhos",
        descricao: '"Eles trancaram o céu com fumaça de fábrica para que esquecêssemos as estrelas. Mas um sonho verdadeiro não precisa de permissão do maquinista para se tornar real."',
        habilidades: `
            <h4>Grau 1: A Centelha de Aspiração</h4>
            <p><strong>Luz Estreante [Ativa - Reação]:</strong> Quando manifestar o Dado 1, transmita a Verdade Oculta a um aliado a até 6 metros, dando-lhe Vantagem (+1d20) na próxima ação mística. Custo: 2 PF + 1d4 de Sanidade.</p>
            <p><strong>Centelha de Esperança [Passiva]:</strong> No Estágio II de loucura, sua mente se mantém estável e imune a espasmos destrutivos.</p>
            
            <h4>Grau 2: O Poço de Calmaria</h4>
            <p><strong>Alinhamento de Fluidos [Ativa]:</strong> Projeta névoa luminescente de lavanda. Aliados lá limpam um marcador de Estresse e recebem +2 contra Presença Aterrorizante. Custo: 2 PF + 1d4 de Sanidade.</p>
            <p><strong>Seu Maior Desejo [Ativa]:</strong> Mostra visualmente o maior desejo do coração de uma pessoa, impedindo-a de enlouquecer na rodada. Custo: 3 PF.</p>
        `
    },
    {
        id: "lua",
        nome: "Caminho da Lua",
        descricao: '"A névoa não esconde as coisas; ela apenas mostra o que você mais teme ver. Na escuridão, a diferença entre um monstro real e a sua própria loucura é apenas uma questão de ângulo."',
        habilidades: `
            <h4>Grau 1: O Habitante do Reflexo</h4>
            <p><strong>Fluidez Lunar [Passiva]:</strong> Quando manifestar o Dado 1, o Mestre revela duas verdades concorrentes e contraditórias que coexistem na sala até que alguém interaja com o elemento.</p>
            <p><strong>Reflexo de Prata [Ativa]:</strong> Distorce sua posição física usando silhuetas de fumaça. O próximo ataque sofre Desvantagem (-1d20). Custo: 1 PF.</p>
            
            <h4>Grau 2: O Véu de Prata</h4>
            <p><strong>Miragem da Membrana [Ativa]:</strong> Altera a percepção visual de um objeto ou ameaça de NP 1 por 2 rodadas. Pode fazer um perigo parecer inofensivo. Custo: 2 PF + 1d4 de Sanidade Atual.</p>
        `
    },
    {
        id: "sol",
        nome: "Caminho do Sol",
        descricao: '"A névoa deste mundo é espessa, mas o meu peito carrega o fogo da primeira fornalha do cosmos. Sob a minha luz, até o horror mais profundo é obrigado a projetar uma sombra humana."',
        habilidades: `
            <h4>Grau 1: A Centelha Alva</h4>
            <p><strong>Revelação Incandescente [Passiva]:</strong> Quando gerar o Dado 1, a luz queima a névoa. Você e aliados adjacentes ganham Vantagem (+1d20) em testes de Percepção na rodada.</p>
            <p><strong>Foco Purificador [Ativa]:</strong> Emite um feixe de luz que causa 1d6 de dano radiante a uma Máscara e expõe sua posição. Custo: 1 PF.</p>
            
            <h4>Grau 2: O Prisma de Clareza</h4>
            <p><strong>Farol da Razão [Ativa - Reação]:</strong> Quando um aliado for alvo de fobia ou ilusão, derrete a mentira mística instantaneamente, restaurando 1d6 de Sanidade. Custo: 2 PF.</p>
        `
    },
    {
        id: "julgamento",
        nome: "Caminho do Julgamento",
        descricao: '"O som da última trombeta não vem dos céus; ele ecoa de dentro do peito daqueles que rasgaram o sudário da ignorância e decidiram acordar."',
        habilidades: `
            <h4>Grau 1: O Arauto do Eco</h4>
            <p><strong>Veredito Prévio [Passiva]:</strong> Sempre que manifestar o Dado 1, ganha a Verdade Oculta e a próxima jogada de ataque de um aliado recebe Vantagem (+1d20).</p>
            <p><strong>Apelo da Consciência [Ativa]:</strong> Força um NPC ou inimigo racional a confrontar seus pecados, deixando-o pasmo. Custo: 1 PF.</p>
            
            <h4>Grau 2: A Sentença de Retorno</h4>
            <p><strong>Retribuição Axiomática [Ativa - Reação]:</strong> Quando uma Máscara infligir ferimento grave a você ou aliado, o próximo ataque bem-sucedido do grupo causará dano dobrado. Custo: 2 PF + 1d4 de Sanidade Atual.</p>
        `
    },
    {
        id: "mundo",
        nome: "Caminho do Mundo",
        descricao: '"O Abismo pensa que pode engolir fragmento por fragmento. Ele esquece que a Realidade não é uma colcha de retalhos, mas uma obra perfeita. E eu sou aquele que segura a caneta."',
        habilidades: `
            <h4>Grau 1: O Andarilho do Globo</h4>
            <p><strong>Passo Cosmopolita [Passiva]:</strong> Ignora penalidades de movimento de terrenos difíceis conceituais. Ao manifestar o Dado 1, sua velocidade dobra na rodada.</p>
            <p><strong>Conexão Telúrica [Ativa]:</strong> Sente as linhas de força de uma sala, revelando passagens secretas ou armadilhas. Custo: 1 PF.</p>

            <h4>Grau 2: A Linha do Horizonte</h4>
            <p><strong>Expansão de Espaço [Ativa]:</strong> Altera as dimensões da sala por 2 rodadas, afastando ou aproximando distâncias. Custo: 2 PF + 1d4 de Sanidade Atual.</p>
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
            <p><strong>Escudo da Memória [Ativa - Reação]:</strong> Absorve o impacto mental de um aliado manifestando o Dado 1, salvando-o do Estresse. Custo: 2 PF + 1d4 de Sanidade Atual.</p>
        `
    },
    {
        id: "fortuna",
        nome: "Caminho da Fortuna",
        descricao: '"A Roda não possui memória. Ela não celebra quem está no topo, nem chora por quem caiu ao fundo; ela apenas continua girando."',
        habilidades: `
            <h4>Grau 1: O Aprendiz do Giro</h4>
            <p><strong>Impulso Entrópico [Passiva]:</strong> Sempre que manifestar o Dado 1, sua próxima ação na mesma cena recebe Vantagem (+1d20).</p>
            <p><strong>Um Pouco de Sorte [Passiva]:</strong> Caso falhe em uma DT, você pode re-rolar o menor dado até conseguir um número maior que o anterior.</p>
            
            <h4>Grau 2: O Ponto de Virada</h4>
            <p><strong>Inversão Polar [Ativa - Uma vez por Cena]:</strong> Transforma uma Desvantagem (-1d20) aplicada a você ou a um aliado em uma Vantagem (+1d20) de igual valor. Custo: 2 PF + 1d4 de Sanidade Atual.</p>
        `
    },
    {
        id: "pioneiro",
        nome: "Caminho do Pioneiro",
        descricao: '"Alguém precisa dar o primeiro passo no escuro para que os outros saibam onde pisar. Se o chão sumir, eu invento o próximo centímetro."',
        habilidades: `
            <h4>Grau 1: O Batedor da Membrana</h4>
            <p><strong>Trilha de Fuligem [Passiva]:</strong> Ao realizar o primeiro teste de Navegação por Afinidade na sessão, você recebe Vantagem (+1d20).</p>
            <p><strong>Recalibrar Foco [Ativa]:</strong> Se o grupo se dispersar, impede que andem em círculos eternamente. Custo: 1 PF + 1d4 de Sanidade Atual.</p>
            
            <h4>Grau 2: O Cartógrafo do Caos</h4>
            <p><strong>Bússola Semântica [Passiva]:</strong> Sempre que rolar o Dado 1, pode abdicar da Verdade Oculta para que o Mestre revele a rota física mais rápida até o objetivo.</p>
        `
    },
    {
        id: "louco",
        nome: "Caminho do Louco",
        descricao: '"Vocês chamam de perda de controle. Eu chamo de parar de fingir que as paredes são de concreto. O abismo é um ótimo lugar para dar um passeio."',
        habilidades: `
            <h4>Grau 1: O Passo Inconsequente</h4>
            <p><strong>Ignorância Sagrada [Passiva]:</strong> Na primeira vez que manifestar o Dado 1 em uma cena, perde Sanidade, mas não recebe o marcador de Estresse Akedôntico.</p>
            
            <h4>Grau 2: Desrazão Guiada</h4>
            <p><strong>Sorte dos Desesperados [Passiva]:</strong> Se obtiver um sucesso rolando sob Desvantagem, transforma em ação espetacular. O Mestre avança 1 Tique Oculto no Relógio de Sombra.</p>
        `
    },
    {
        id: "mago",
        nome: "Caminho do Mago",
        descricao: '"Assim como em cima, é embaixo. Se a realidade mundana é uma mentira bem contada, eu escolho ser o narrador."',
        habilidades: `
            <h4>Grau 1: O Ilusionista da Membrana</h4>
            <p><strong>Vontade Concreta [Ativa]:</strong> Materializa uma ideia simples em forma de luz sólida e branca por 1 rodada. Custo: 2 PF + 2d4 de Sanidade Atual.</p>
            
            <h4>Grau 2: O Canalizador do Verbo</h4>
            <p><strong>Alquimia Verbal [Ativa - Uma vez por Cena]:</strong> Teste de Cognição ou Percepção (DT 18) para arrancar uma Verdade Oculta do cenário. Custo: 2 PF.</p>
            <p><strong>Mestre das Palavras [Ativa]:</strong> Permite misturar e imbuir conceitos no mundo ao redor (ex: Pistola + Água = Pistola de Água). Custo: 2 PF por mistura.</p>
        `
    },
    {
        id: "sacerdotisa",
        nome: "Caminho da Sacerdotisa",
        descricao: '"A verdade não grita na fumaça das chaminés; ela sussurra no silêncio dos espelhos cobertos de veludo. Para ouvir o cosmos, você precisa primeiro calar o mundo."',
        habilidades: `
            <h4>Grau 1: A Ouvinte do Silêncio</h4>
            <p><strong>Intuição Velada [Passiva]:</strong> Se não realizar ação barulhenta por uma rodada, ganha Vantagem (+1d20) no próximo teste de Percepção ou Cognição.</p>
            <p><strong>Aura de Cura [Ativa]:</strong> Manifesta uma aura na mão que recupera 2d6 de vida. Custo: 2 PF + 1d4 de Sanidade.</p>
            <p><strong>Detecção de Mentiras [Ativa]:</strong> Discernimento instantâneo da verdade. Custo: 1 PF + 1d4+1 de dano mental.</p>
            
            <h4>Grau 2: A Cortina de Veludo</h4>
            <p><strong>Ocultamento [Ativa]:</strong> Manipula o conceito de presença do grupo, ignorando totalmente a percepção passiva de Máscaras de NP 1 ou 2. Custo: 2 PF + 1d4 de Sanidade Atual.</p>
        `
    },
    {
        id: "imperatriz",
        nome: "Caminho da Imperatriz",
        descricao: '"A névoa obedece a quem dita as ordens. O Avesso pode ser um monarca caótico, mas eu sou a dona do berço."',
        habilidades: `
            <h4>Grau 1: A Matriarca da Névoa</h4>
            <p><strong>Concepção Espontânea [Ativa Reação]:</strong> Quando manifestar o Dado 1, a Verdade Oculta se materializa instantaneamente como um recurso físico abundante. Custo: 2 PF + 2d4 de Sanidade.</p>
            <p><strong>Onisciência de uma Imperatriz [Passiva]:</strong> Sabe exatamente onde estão e o que fazem todos os seus Súditos.</p>
            
            <h4>Grau 2: O Decreto Soberano</h4>
            <p><strong>Majestade Opressora [Passiva]:</strong> Ganha Vantagem (+1d20) para comandar NPCs humanos. Máscaras de NP 1 são incapazes de atacar você voluntariamente na primeira rodada.</p>
            <p><strong>Eu Ordeno [Ativa]:</strong> Dá ordem simples a entidade de até NP 1 ou Grau 2. O alvo deve resistir à DT=12+Influência. Custo: 2 PF.</p>
        `
    },
    {
        id: "imperador",
        nome: "Caminho do Imperador",
        descricao: '"O Caos exige um nome; o Avesso exige uma jaula. Se a realidade está rachando, eu reforçarei os pregos."',
        habilidades: `
            <h4>Grau 1: O Construtor do Ferro</h4>
            <p><strong>Estrutura de Contenção [Ativa - Reação]:</strong> Quando rolar o Dado 1 e o cenário tentar se deformar, a fuligem se solidifica em uma parede de ferro. Custo: 1 PF + 1d4 pontos de Sanidade.</p>
            <p><strong>Cetro do Rei [Passiva]:</strong> Manifesta um cetro que serve como símbolo de poder e arma (causa 2d4 de dano).</p>
            
            <h4>Grau 2: O Decreto de Custódia</h4>
            <p><strong>Grilhões de Linha [Ativa]:</strong> Injeta o conceito de "Estar Preso" em uma Máscara de NP 1. Você dita restrição geométrica por 2 rodadas. Custo: 2 PF + 1d6 pontos de Sanidade.</p>
        `
    },
    {
        id: "estudioso",
        nome: "Caminho do Estudioso",
        descricao: '"O Avesso não é o caos; é apenas uma língua antiga cuja gramática vocês se recusam a estudar. Até a loucura obedece a uma sintaxe."',
        habilidades: `
            <h4>Grau 1: O Exegeta da Névoa</h4>
            <p><strong>Lição Compartilhada [Ativa - Reação]:</strong> Ao gerar o Dado 1, absorve o Estresse, mas concede Vantagem (+1d20) na próxima ação de um aliado. Custo: 1 PF + 1d4 pontos de Sanidade.</p>
            <p><strong>Estudioso Sem Fundo [Passiva]:</strong> Capacidade de armazenar conhecimentos. Ao atingir o Grau 3, permite adquirir habilidade de Grau 1 de outro caminho.</p>
            
            <h4>Grau 2: O Dogma da Contenção</h4>
            <p><strong>Tese Ortodoxa [Ativa]:</strong> Recita regra taxonômica sobre Máscara de NP 1 impedindo-a de usar Vantagem na Oposição. Custo: 2 PF + 1d6 de Sanidade Atual.</p>
            <p><strong>Forçando o Conhecimento [Ativa]:</strong> Permite utilizar uma habilidade de Grau 1 de um de seus aliados. Custo: 3 PF + 2d6 de sanidade.</p>
        `
    },
    {
        id: "romance",
        nome: "Caminho do Romance",
        descricao: '"A engrenagem desta cidade quer nos transformar em números isolados. Mas enquanto eu lembrar do seu nome, o Avesso não poderá reescrever o meu."',
        habilidades: `
            <h4>Grau 1: O Eco da Afinidade</h4>
            <p><strong>Almas Gêmeas [Passiva]:</strong> No início da sessão, escolha um aliado para ser seu Par.</p>
            <p><strong>Dividir o Fardo [Ativa - Reação]:</strong> Quando seu Par rolar o Dado 1 e sofrer Estresse, você puxa metade do estresse dele para si. Ambos ganham a Verdade. Custo: 1 PF + 1d6 ponto de Sanidade.</p>
            
            <h4>Grau 2: A Encruzilhada de Névoa</h4>
            <p><strong>O Peso da Escolha [Ativa]:</strong> Diante de bifurcação, força o Mestre a revelar a opção com menos atrito no Relógio. Custo: 2 PF + 1d4 pontos de Sanidade Atual.</p>
            <p><strong>Troca de Lugar [Ativa - Reação]:</strong> Permite trocar de posição física instantaneamente com seu par. Custo: 2 PF.</p>
        `
    },
    {
        id: "carro",
        nome: "Caminho do Carro",
        descricao: '"Se não há uma estrada pavimentada através do Abismo, nós abriremos uma na marreta e na velocidade. Nada freia uma mente que sabe exatamente para onde está indo."',
        habilidades: `
            <h4>Grau 1: O Mestre da Arrancada</h4>
            <p><strong>Vetor Inabalável [Passiva]:</strong> Em perseguições, fugas ou investidas na Membrana, você recebe Vantagem (+1d20) em Proeza ou Navegação por Afinidade. Se gerar o Dado 1, converte o sussurro em adrenalina: ganha a Verdade Oculta e ignora terrenos difíceis na rodada.</p>
            
            <h4>Grau 2: As Rédeas de Ferro</h4>
            <p><strong>Tração Concorrente [Ativa]:</strong> Por 2 rodadas, sempre que o cenário tentar se mover ou mudar por Leis Akedônticas, você escolhe a direção exata da mudança, dando "carona" ao grupo. Custo: 2 PF + 1d4 pontos de Sanidade Atual.</p>
            <p><strong>Positivo e Negativo [Ativa]:</strong> Adiciona polos magnéticos a até dois objetos/seres. Custo: 2 PF.</p>
        `
    },
    {
        id: "forca",
        nome: "Caminho da Força",
        descricao: '"A névoa esconde dentes, garras e fome. Eles acham que são os predadores desta cidade, mas esqueceram que fomos nós que inventamos as correntes e o chicote."',
        habilidades: `
            <h4>Grau 1: O Vetor da Teimosia</h4>
            <p><strong>Dor Convertida [Passiva]:</strong> Sempre que manifestar o Dado 1 e sofrer Estresse Akedôntico, reativamente ganha Vantagem (+1d20) em qualquer teste de Proeza ou salvaguarda física realizado até o fim da rodada.</p>
            <p><strong>Vigor Firme [Passiva]:</strong> Você adquire permanentemente +1 em Proeza e +10 de Vida Máxima.</p>
            
            <h4>Grau 2: A Couraça de Fuligem</h4>
            <p><strong>Tolerância Industrial [Ativa - Reação]:</strong> Ao sofrer dano físico direto de uma Máscara ou colapso, reduz o dano de Vitalidade recebido pela metade. Custo: 2 PF + 1d6 pontos de Sanidade.</p>
            <p><strong>Minha Mente também é Forte [Ativa - Reação]:</strong> Permite queimar sua própria vitalidade para blindar a mente, reduzindo o dano de presença das criaturas pela metade. Custo: 2 PF + 3d6 de Vida.</p>
        `
    },
    {
        id: "eremita",
        nome: "Caminho do Eremita",
        descricao: '"A névoa engole os que andam em bando procurando aprovação. No fundo do Abismo, a única luz que importa é aquela que você acende dentro de sua própria mente."',
        habilidades: `
            <h4>Grau 1: O Portador da Lanterna</h4>
            <p><strong>Lanterna de Querosene [Passiva]:</strong> Você recebe uma lanterna retorcida e estranha que serve de canalizador (item inicial).</p>
            <p><strong>Claridade Solitária [Ativa - Reação]:</strong> Quando você ou um aliado a até 3 metros rolar o Dado 1, emite um estalo de luz branca que limpa o marcador de Estresse. Custo: 2 PF + 1d4 pontos de Sanidade.</p>
            <p><strong>Lanterna Espanta Males [Ativa]:</strong> Usa a luz focada da lanterna para acalmar as mentes do grupo, recuperando 3d4 de Sanidade para os aliados presentes. Custo: 3 PF.</p>
            
            <h4>Grau 2: O Manto de Solitude</h4>
            <p><strong>Isolamento Semântico [Ativa]:</strong> Puxa sua identidade para a periferia conceitual da sala por 2 rodadas. Você não pode ser alvo de habilidades ou ataques diretos de Máscaras de NP 1 ou 2. Custo: 2 PF + 1d4 ponto de Sanidade Atual.</p>
        `
    },
    {
        id: "justica",
        nome: "Caminho da Justiça",
        descricao: '"O Avesso violou a propriedade da carne e distorceu o nome das coisas. Minha balança não mede ouro ou intenções; ela mede o crime de existir fora da Realidade."',
        habilidades: `
            <h4>Grau 1: O Meirinho</h4>
            <p><strong>Lei da Reciprocidade [Ativa - Reação]:</strong> Ao manifestar o Dado 1 e receber Estresse Akedôntico, projeta a culpa: uma Máscara de NP 1 ou 2 em linha de visão sofre -1d20 em sua próxima Oposição. Custo: 2 PF + 1d6 ponto de Sanidade Atual.</p>
            <p><strong>Sem Mentiras [Passiva]:</strong> Você se torna incapaz de mentir. Se descobrir a mentira de alguém, pode usar uma reação ativa para lançar uma maldição de desvantagem no mentiroso.</p>
            
            <h4>Grau 2: A Balança de Carvão</h4>
            <p><strong>Olho por Olho [Ativa]:</strong> Quando um aliado a até 6 metros sofrer dano de uma Máscara, marca a criatura como "Inadimplente". O próximo ataque do grupo ganha Vantagem (+1d20). Custo: 3 PF + 1d8 pontos de Sanidade.</p>
        `
    },
    {
        id: "enforcado",
        nome: "Caminho do Enforcado",
        descricao: '"Vocês chamam de derrota porque eu parei de andar. Mas quando você aceita o peso da corda, percebe que o chão que vocês pisam é apenas o teto de um abismo muito maior."',
        habilidades: `
            <h4>Grau 1: O Olhar Invertido</h4>
            <p><strong>Claridade Estática [Passiva]:</strong> Ao manifestar o Dado 1, você pode optar por imobilizar voluntariamente seu corpo até seu próximo turno. O estresse é amortecido e o Mestre entrega duas Verdades Ocultas em vez de uma.</p>
            <p><strong>A Verdade está no Sofrimento [Ativa]:</strong> Permite rever uma cena específica do passado materializada no ambiente em líquido vermelho. Custo: 2 PF + 2d6 de Vida.</p>
            
            <h4>Grau 2: O Laço de Procura</h4>
            <p><strong>Martírio Substitutivo [Ativa - Reação]:</strong> Quando um aliado a até 6 metros falhar em uma Resistência ao Absurdo, você assume o fardo por ele, absorvendo toda a perda mental. Custo: 2 PF + 1d6 ponto de Sanidade.</p>
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
