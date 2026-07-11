// ==========================================
// FILTRO DA BIBLIOTECA DA COMUNIDADE
// ==========================================
function filtrarFeed(categoria) {
    // 1. Atualiza visual dos botões
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // 2. Filtra os cartões na tela
    const cards = document.querySelectorAll('.post-card');
    
    cards.forEach(card => {
        if (categoria === 'tudo') {
            card.style.display = 'flex';
        } else {
            // Verifica se o card tem a classe da categoria (ex: .criatura, .campanha)
            if (card.classList.contains(categoria)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// ==========================================
// INTERAÇÕES (CURTIR, FAVORITAR, SALVAR)
// ==========================================
function toggleInteracao(botao, tipo) {
    botao.classList.toggle('ativo');
    
    // Se for curtir, fazemos uma matemática simples para aumentar o número
    if (tipo === 'like') {
        const spanNumero = botao.querySelector('span');
        let likes = parseInt(spanNumero.innerText);
        
        if (botao.classList.contains('ativo')) {
            spanNumero.innerText = likes + 1;
        } else {
            spanNumero.innerText = likes - 1;
        }
    }
    
    // Se for salvar, mudamos o texto
    if (tipo === 'save') {
        if (botao.classList.contains('ativo')) {
            botao.innerHTML = '<i class="fas fa-bookmark"></i> Salvo';
        } else {
            botao.innerHTML = '<i class="fas fa-bookmark"></i> Salvar';
        }
    }
}

// ==========================================
// PERFIL DO CRIADOR (MODAL)
// ==========================================
const modalOverlay = document.getElementById('creatorProfileModal');
const modalName = document.getElementById('modalCreatorName');

function abrirPerfilCriador(nomeAutor) {
    // Atualiza o nome no modal com quem foi clicado
    modalName.innerText = "@" + nomeAutor;
    // Abre a tela por cima
    modalOverlay.classList.add('active');
}

function fecharPerfilCriador() {
    modalOverlay.classList.remove('active');
}

// Fechar clicando fora da caixa
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        fecharPerfilCriador();
    }
});

// Botão de Seguir
function toggleFollow(botao) {
    const contadorSeguidores = document.getElementById('modalFollowerCount');
    let numSeguidores = parseInt(contadorSeguidores.innerText);

    botao.classList.toggle('seguindo');
    
    if (botao.classList.contains('seguindo')) {
        botao.innerText = 'Seguindo';
        contadorSeguidores.innerText = numSeguidores + 1;
    } else {
        botao.innerText = 'Seguir';
        contadorSeguidores.innerText = numSeguidores - 1;
    }
}
// ... (seu código anterior do modal e botões de seguir continua aqui em cima) ...

// ==========================================
// CONTROLE DE AUTENTICAÇÃO E PUBLICAÇÃO
// ==========================================
function iniciarPublicacao() {
    // Pega o usuário logado atualmente no Firebase
    const user = firebase.auth().currentUser;

    if (user) {
        // Usuário está logado (Conectou com Google)
        console.log("Usuário logado:", user.displayName);
        abrirModalDePublicacao(); 
    } else {
        // Usuário NÃO está logado
        alert("Você precisa conectar sua conta do Google para compartilhar um acervo com a comunidade!");
        fazerLoginComGoogle(); 
    }
}

function fazerLoginComGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            console.log("Login realizado com sucesso!", result.user.displayName);
            abrirModalDePublicacao();
        })
        .catch((error) => {
            console.error("Erro ao fazer login:", error);
            alert("Não foi possível conectar com o Google. Tente novamente.");
        });
}

function abrirAcervo(idAcervo) {
    console.log("Abrindo acervo: ", idAcervo);
}
