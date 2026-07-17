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
// ==========================================
// CONTROLE DO MODAL DE PUBLICAÇÃO
// ==========================================
const publishModal = document.getElementById('publishModal');

// Função chamada após a autenticação bem-sucedida (já declarada no seu código)
function abrirModalDePublicacao() {
    publishModal.classList.add('active');
}

// Função para fechar o modal e limpar os campos
function fecharModalPublicacao() {
    publishModal.classList.remove('active');
    document.getElementById('formPublicacao').reset(); // Limpa o formulário ao fechar
}

// Fechar clicando fora da caixa do modal
publishModal.addEventListener('click', function(e) {
    if (e.target === publishModal) {
        fecharModalPublicacao();
    }
});

// ==========================================
// LÓGICA DE CRIAÇÃO DA NOVA PUBLICAÇÃO
// ==========================================
document.getElementById('formPublicacao').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede a página de recarregar

    // 1. Captura os valores digitados pelo usuário
    const titulo = document.getElementById('pubTitulo').value;
    const categoria = document.getElementById('pubCategoria').value;
    const imgUrl = document.getElementById('pubImg').value;
    const desc = document.getElementById('pubDesc').value;

    // 2. Define o nome do autor com base no Firebase (ou fallback se estiver testando sem login)
    let nomeAutor = "InvestigadorAnônimo";
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
        // Tira os espaços do nome para gerar a tag (ex: @MestreGallo)
        nomeAutor = firebase.auth().currentUser.displayName.replace(/\s+/g, '') || "Investigador";
    }

    // 3. Formata o nome da tag visual para o card
    const tagTexto = categoria.charAt(0).toUpperCase() + categoria.slice(1);

    // 4. Constrói o novo elemento HTML para o feed
    const novoPost = document.createElement('article');
    novoPost.className = `post-card ${categoria}`;
    novoPost.innerHTML = `
        <div class="post-image" style="background-image: url('${imgUrl}');"></div>
        <div class="post-content">
            <span class="post-tag">${tagTexto}</span>
            <h2 class="post-title">${titulo}</h2>
            <p class="post-author" onclick="abrirPerfilCriador('${nomeAutor}')">Por: <strong>@${nomeAutor}</strong></p>
            <p class="post-desc">${desc}</p>
        </div>
        <div class="post-actions">
            <div class="action-group">
                <button class="action-btn like-btn" onclick="toggleInteracao(this, 'like')"><i class="fas fa-heart"></i> <span>0</span></button>
                <button class="action-btn fav-btn" onclick="toggleInteracao(this, 'fav')"><i class="fas fa-star"></i></button>
                <button class="action-btn comment-btn"><i class="fas fa-comment"></i> 0</button>
            </div>
            <button class="action-btn save-btn" onclick="toggleInteracao(this, 'save')"><i class="fas fa-bookmark"></i> Salvar</button>
        </div>
        <button class="action-btn view-btn" style="width:100%; border-top:1px solid #333; border-radius:0 0 8px 8px; padding: 10px;" onclick="abrirAcervo('novo_acervo')">
            <i class="fas fa-eye"></i> Acessar
        </button>
    `;

    // 5. Insere o card como o PRIMEIRO item do feed (topo da lista)
    const feedContainer = document.getElementById('feedContainer');
    feedContainer.prepend(novoPost);

    // 6. Fecha o modal
    fecharModalPublicacao();
    
    // (Opcional) Aqui futuramente você adicionaria o código para salvar a publicação no Banco de Dados do Firebase Realtime/Firestore
});
