// Controle de Áudio
const audioToggle = document.getElementById('audioToggle');
const ambientMusic = document.getElementById('ambientMusic');
let isPlaying = false;
// APLICAÇÃO GLOBAL DE TEMA
document.addEventListener('DOMContentLoaded', () => {
    const temaSalvo = localStorage.getItem('amestia_user_theme');
    if (temaSalvo && temaSalvo.startsWith('theme-')) {
        document.body.classList.add(temaSalvo);
    }
});


// O áudio é configurado com um volume bem baixo para não assustar (20%)
ambientMusic.volume = 0.2;

audioToggle.addEventListener('click', () => {
    if (isPlaying) {
        ambientMusic.pause();
        audioToggle.innerHTML = '<i class="fas fa-music"></i>';
    } else {
        ambientMusic.play();
        audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    isPlaying = !isPlaying;
});

// Sistema de Partículas e "Costuras Luminosas"
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];

// Ajusta o tamanho do canvas para o tamanho da tela
function initCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
initCanvasSize();
window.addEventListener('resize', initCanvasSize);

// Classe da Partícula
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Tamanho entre 1 e 3
        this.speedX = (Math.random() - 0.5) * 0.5; // Movimento lento
        this.speedY = (Math.random() - 0.5) * 0.5;
        // Alterna entre roxo e azul escuro
        this.color = Math.random() > 0.5 ? 'rgba(122, 27, 156, 0.8)' : 'rgba(27, 75, 156, 0.8)';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Se sair da tela, volta pelo outro lado
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Inicializa as partículas
function initParticles() {
    particlesArray = [];
    const numberOfParticles = (canvas.width * canvas.height) / 9000; // Densidade
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Conecta as partículas próximas formando as "costuras"
function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                         + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if (distance < 15000) { // Distância para conectar
                let opacity = 1 - (distance / 15000);
                // Cor da costura luminosa
                ctx.strokeStyle = `rgba(122, 27, 156, ${opacity * 0.2})`; 
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Loop de animação
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
// ===============================================
// BIOGRAFIA EDITÁVEL
// ===============================================
const userBio = document.getElementById('userBio');

// Carrega a biografia salva
const bioSalva = localStorage.getItem('amestia_user_bio');
if (bioSalva) userBio.innerText = bioSalva;

// Salva a biografia automaticamente sempre que o usuário clicar fora do texto (blur)
userBio.addEventListener('blur', () => {
    localStorage.setItem('amestia_user_bio', userBio.innerText);
});

// ===============================================
// SISTEMA DINÂMICO DE CONQUISTAS E ESTATÍSTICAS
// ===============================================
function atualizarConquistas() {
    // Busca dados reais que você já programou nos outros arquivos!
    const personagens = JSON.parse(localStorage.getItem('amestia_personagens')) || [];
    const campanhas = JSON.parse(localStorage.getItem('campanhasSalvas')) || [];

    const numPersonagens = personagens.length;
    const numCampanhas = campanhas.length;

    // Conquista 1: O Arquiteto de Almas (Exige 3+ personagens)
    const achCriador = document.getElementById('ach_criador');
    if (achCriador && numPersonagens >= 3) {
        achCriador.classList.remove('locked');
        achCriador.classList.add('unlocked');
    }

    // Conquista 2: Mestre do Véu (Exige 1+ campanhas)
    const achMestre = document.getElementById('ach_mestre');
    if (achMestre && numCampanhas >= 1) {
        achMestre.classList.remove('locked');
        achMestre.classList.add('unlocked');
    }
}

// Executa a checagem ao carregar a página
window.addEventListener('DOMContentLoaded', atualizarConquistas);

// ===============================================
// SISTEMA DE TRADUÇÃO (MULTI-IDIOMA)
// ===============================================
// Dicionário com as traduções baseadas nas chaves do 'data-lang'
const dicionario = {
    'pt-br': {
        'estatisticas': '<i class="fas fa-chart-line"></i> Estatísticas de Jogo',
        'conquistas': '<i class="fas fa-trophy"></i> Conquistas e Títulos',
        'ach1_titulo': 'O Arquiteto de Almas',
        'ach1_desc': 'Crie pelo menos 3 personagens no sistema.',
        'ach2_titulo': 'Mestre do Véu',
        'ach2_desc': 'Crie e inicie a sua primeira campanha.'
    },
    'en': {
        'estatisticas': '<i class="fas fa-chart-line"></i> Game Statistics',
        'conquistas': '<i class="fas fa-trophy"></i> Achievements & Titles',
        'ach1_titulo': 'Architect of Souls',
        'ach1_desc': 'Create at least 3 characters in the system.',
        'ach2_titulo': 'Master of the Veil',
        'ach2_desc': 'Create and start your first campaign.'
    },
    'es': {
        'estatisticas': '<i class="fas fa-chart-line"></i> Estadísticas de Juego',
        'conquistas': '<i class="fas fa-trophy"></i> Logros y Títulos',
        'ach1_titulo': 'El Arquitecto de Almas',
        'ach1_desc': 'Crea al menos 3 personajes en el sistema.',
        'ach2_titulo': 'Maestro del Velo',
        'ach2_desc': 'Crea e inicia tu primera campaña.'
    }
};

function aplicarIdioma(idioma) {
    const elementos = document.querySelectorAll('[data-lang]');
    elementos.forEach(el => {
        const chave = el.getAttribute('data-lang');
        // Se a chave existir no dicionário do idioma escolhido, altera o HTML interno
        if (dicionario[idioma] && dicionario[idioma][chave]) {
            el.innerHTML = dicionario[idioma][chave];
        }
    });
}

// Vincula a troca de idioma ao <select> que você já tem no HTML
const seletorIdioma = document.getElementById('langSelect');
if (seletorIdioma) {
    // Carrega o idioma salvo ao entrar na página
    const idiomaSalvo = localStorage.getItem('amestia_user_lang') || 'pt-br';
    seletorIdioma.value = idiomaSalvo;
    aplicarIdioma(idiomaSalvo);

    seletorIdioma.addEventListener('change', (e) => {
        const novoIdioma = e.target.value;
        localStorage.setItem('amestia_user_lang', novoIdioma);
        aplicarIdioma(novoIdioma);
    });
}
// ===============================================
// SISTEMA DE TRADUÇÃO (MULTI-IDIOMA)
// ===============================================
// Dicionário com as traduções baseadas nas chaves do 'data-lang'
const dicionario = {
    'pt-br': {
        // Traduções do Menu
        'nav_inicio': 'Início',
        'nav_biblioteca': 'Biblioteca',
        'nav_personagens': 'Personagens',
        'nav_criar': 'Criar Personagem',
        'nav_campanhas': 'Campanhas',
        'nav_banco': 'Banco de Dados',
        'nav_comunidade': 'Comunidade',
        
        // Traduções do Perfil
        'estatisticas': '<i class="fas fa-chart-line"></i> Estatísticas de Jogo',
        'conquistas': '<i class="fas fa-trophy"></i> Conquistas e Títulos',
        'ach1_titulo': 'O Arquiteto de Almas',
        'ach1_desc': 'Crie pelo menos 3 personagens no sistema.',
        'ach2_titulo': 'Mestre do Véu',
        'ach2_desc': 'Crie e inicie a sua primeira campanha.'
    },
    'en': {
        // Traduções do Menu
        'nav_inicio': 'Home',
        'nav_biblioteca': 'Library',
        'nav_personagens': 'Characters',
        'nav_criar': 'Create Character',
        'nav_campanhas': 'Campaigns',
        'nav_banco': 'Database',
        'nav_comunidade': 'Community',
        
        // Traduções do Perfil
        'estatisticas': '<i class="fas fa-chart-line"></i> Game Statistics',
        'conquistas': '<i class="fas fa-trophy"></i> Achievements & Titles',
        'ach1_titulo': 'Architect of Souls',
        'ach1_desc': 'Create at least 3 characters in the system.',
        'ach2_titulo': 'Master of the Veil',
        'ach2_desc': 'Create and start your first campaign.'
    },
    'es': {
        // Traduções do Menu
        'nav_inicio': 'Inicio',
        'nav_biblioteca': 'Biblioteca',
        'nav_personagens': 'Personajes',
        'nav_criar': 'Crear Personaje',
        'nav_campanhas': 'Campañas',
        'nav_banco': 'Base de Datos',
        'nav_comunidade': 'Comunidad',
        
        // Traduções do Perfil
        'estatisticas': '<i class="fas fa-chart-line"></i> Estadísticas de Juego',
        'conquistas': '<i class="fas fa-trophy"></i> Logros y Títulos',
        'ach1_titulo': 'El Arquitecto de Almas',
        'ach1_desc': 'Crea al menos 3 personajes en el sistema.',
        'ach2_titulo': 'Maestro del Velo',
        'ach2_desc': 'Crea e inicia tu primera campaña.'
    }
};

function aplicarIdioma(idioma) {
    const elementos = document.querySelectorAll('[data-lang]');
    elementos.forEach(el => {
        const chave = el.getAttribute('data-lang');
        // Se a chave existir no dicionário do idioma escolhido, altera o HTML interno
        if (dicionario[idioma] && dicionario[idioma][chave]) {
            el.innerHTML = dicionario[idioma][chave];
        }
    });
}

// Vincula a troca de idioma ao <select> que você já tem no HTML
const seletorIdioma = document.getElementById('langSelect');
if (seletorIdioma) {
    // Carrega o idioma salvo ao entrar na página
    const idiomaSalvo = localStorage.getItem('amestia_user_lang') || 'pt-br';
    seletorIdioma.value = idiomaSalvo;
    aplicarIdioma(idiomaSalvo);

    seletorIdioma.addEventListener('change', (e) => {
        const novoIdioma = e.target.value;
        localStorage.setItem('amestia_user_lang', novoIdioma);
        aplicarIdioma(novoIdioma);
    });
}