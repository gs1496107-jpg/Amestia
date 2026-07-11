// ===============================================
// INICIALIZAÇÃO E SALVAMENTO AUTOMÁTICO
// ===============================================

// Elementos da DOM
const themeSelect = document.getElementById('themeSelect');
const langSelect = document.getElementById('langSelect');
const toggleMusic = document.getElementById('toggleMusic');
const toggleNotifs = document.getElementById('toggleNotifs');
const togglePrivacy = document.getElementById('togglePrivacy');

const avatarInput = document.getElementById('avatarInput');
const btnEditAvatar = document.getElementById('btnEditAvatar');
const profileImage = document.getElementById('profileImage');

// Carregar dados salvos ao abrir a página
window.addEventListener('DOMContentLoaded', () => {
    // Carregar Foto
    const savedImage = localStorage.getItem('amestia_user_avatar');
    if (savedImage) profileImage.src = savedImage;

    // Carregar Tema
    const savedTheme = localStorage.getItem('amestia_user_theme') || 'dark';
    themeSelect.value = savedTheme;
    aplicarTema(savedTheme);

    // Carregar Toggles
    toggleMusic.checked = localStorage.getItem('amestia_user_music') === 'true';
    toggleNotifs.checked = localStorage.getItem('amestia_user_notifs') !== 'false'; // Padrão true
    togglePrivacy.checked = localStorage.getItem('amestia_user_privacy') === 'true';
});

// ===============================================
// SISTEMA DE FOTO DE PERFIL (GALERIA)
// ===============================================

// Abre o seletor de arquivos ao clicar no botão da câmera
btnEditAvatar.addEventListener('click', () => {
    avatarInput.click();
});

// Lê a imagem escolhida e salva no LocalStorage
avatarInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const base64Image = e.target.result;
            profileImage.src = base64Image;
            localStorage.setItem('amestia_user_avatar', base64Image); // Salvamento automático
        };
        
        reader.readAsDataURL(file);
    }
});

// ===============================================
// SISTEMA DE TEMAS E CONFIGURAÇÕES
// ===============================================

function aplicarTema(tema) {
    // Remove os temas anteriores do body
    document.body.classList.remove('theme-red-black', 'theme-green-black', 'theme-blue-black');
    
    // Adiciona a classe do novo tema (se não for os padrões claro/escuro)
    if (tema.startsWith('theme-')) {
        document.body.classList.add(tema);
    }
    
    // Aqui você pode adicionar lógica para o tema "light" ou "void" se desejar no futuro
}

// Alterar Tema
themeSelect.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    aplicarTema(selectedTheme);
    localStorage.setItem('amestia_user_theme', selectedTheme); // Salvamento automático
});

// Switches de Configuração (Toggles) com salvamento
toggleMusic.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    localStorage.setItem('amestia_user_music', isChecked);
    // Lógica do áudio...
});

toggleNotifs.addEventListener('change', (e) => {
    localStorage.setItem('amestia_user_notifs', e.target.checked);
});

togglePrivacy.addEventListener('change', (e) => {
    localStorage.setItem('amestia_user_privacy', e.target.checked);
});