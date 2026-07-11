// BANCO DE DADOS DOS TERMOS INTERATIVOS (Dicionário do Sistema)
const termDictionary = {
    absurdo: {
        title: "O Absurdo",
        desc: "Um estado de não-existência primordial, um vazio caótico faminto por retomar o espaço da realidade. O nada em sua forma mais pura e violenta, desprovido de qualquer conceito.",
        linkText: "Pesquisar Origem",
        url: "#"
    },
    costura: {
        title: "A Grande Costura",
        desc: "O evento metafísico que organizou o caos e deu origem ao universo através do estabelecimento de decretos semânticos. É a barreira conceitual que mantém o mundo tangível.",
        linkText: "Ler Registros da Criação",
        url: "#"
    },
    primordiais: {
        title: "Os Seis Primordiais",
        desc: "As seis mentes arquetípicas que funcionam como as agulhas cósmicas da criação. Elas puxam os fios da Pura Semântica e sustentam a sanidade e a lógica da humanidade.",
        linkText: "Conhecer as Entidades",
        url: "#"
    },
    veu: {
        title: "O Véu",
        desc: "O vazamento direto do Absurdo para o mundo real. Locais afetados pelo Véu perdem completamente sua lógica estrutural, gerando zonas de entropia conceitual extrema.",
        linkText: "Explorar Relatórios do Véu",
        url: "#"
    }
};

// SELEÇÃO DE ELEMENTOS
const terms = document.querySelectorAll('.interactive-term');
const modal = document.getElementById('termModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalActionBtn = document.getElementById('modalActionBtn');

const btnReadingMode = document.getElementById('btnReadingMode');
const fontIncrease = document.getElementById('fontIncrease');
const fontDecrease = document.getElementById('fontDecrease');
const bookContent = document.getElementById('bookContent');

const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('librarySidebar');

// LÓGICA DO MODAL POPUP
terms.forEach(term => {
    term.addEventListener('click', () => {
        const termKey = term.getAttribute('data-term');
        const data = termDictionary[termKey];
        
        if (data) {
            modalTitle.innerText = data.title;
            modalBody.innerText = data.desc;
            modalActionBtn.innerText = data.linkText;
            modalActionBtn.onclick = () => window.location.href = data.url;
            
            modal.classList.add('active');
        }
    });
});

closeModal.addEventListener('click', () => modal.classList.remove('active'));
window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

// AJUSTE DE FONTE
let currentFontSize = 1.15; // em 'rem'
fontIncrease.addEventListener('click', () => {
    if (currentFontSize < 1.6) {
        currentFontSize += 0.1;
        updateFontSize();
    }
});

fontDecrease.addEventListener('click', () => {
    if (currentFontSize > 0.95) {
        currentFontSize -= 0.1;
        updateFontSize();
    }
});

function updateFontSize() {
    const paragraphs = bookContent.querySelectorAll('.paragraph');
    paragraphs.forEach(p => p.style.fontSize = `${currentFontSize}rem`);
}

// MODO LEITURA / FOCO
btnReadingMode.addEventListener('click', () => {
    document.body.classList.toggle('reading-focused-mode');
    if (document.body.classList.contains('reading-focused-mode')) {
        btnReadingMode.innerHTML = '<i class="fas fa-eye-slash"></i> Sair do Foco';
    } else {
        btnReadingMode.innerHTML = '<i class="fas fa-eye"></i> Modo Foco';
    }
});

// COMPARTILHAR
document.getElementById('btnShare').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link do capítulo copiado para a área de transferência!');
});

// GAVETA DE CAPÍTULOS NO CELULAR
sidebarToggle.addEventListener('click', (e) => {
    sidebar.classList.toggle('open');
    e.stopPropagation();
});

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});
