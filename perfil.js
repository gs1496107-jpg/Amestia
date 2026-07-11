// 1. Puxa os personagens salvos na memória do navegador. Se não houver, inicia vazio.
let personagensSalvos = JSON.parse(localStorage.getItem('amestia_personagens')) || [];

function renderCharacters() {
    const grid = document.getElementById('charGrid');
    const cardNovo = grid.querySelector('.create-new'); // Guarda o botão de "Novo Personagem"

    // Limpa a tela e recoloca o botão de "Novo" no início
    grid.innerHTML = '';
    if (cardNovo) grid.appendChild(cardNovo);

    // 2. Renderiza cada personagem salvo
    personagensSalvos.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        
        // Configuramos o botão de Excluir para chamar a função passando a posição (index) do personagem
        card.innerHTML = `
            <div class="char-portrait" style="background-image: url('${char.imagem || 'https://via.placeholder.com/400x200/1a1a1a/7a1b9c?text=Sem+Imagem'}')">
                <span class="char-status">${char.vivo === false ? 'Morto' : 'Ativo'}</span>
            </div>
            <div class="char-info">
                <h3>${char.nome || 'Desconhecido'}</h3>
                <div class="char-details">
                    <p><strong>Grau:</strong> ${char.grau || 'Iniciante'}</p>
                    <p><strong>Classe:</strong> ${char.raca || '-'} | ${char.caminho || '-'}</p>
                    <p><i class="fas fa-book"></i> ${char.campanha || 'Sem Campanha'}</p>
                </div>
            </div>
            <div class="char-actions">
                <button class="btn-play" onclick="window.location.href='ficha.html?id=${char.id}'"><i class="fas fa-play"></i> Abrir Ficha</button>
                <button class="btn-delete" title="Excluir" onclick="deletarPersonagem(${index})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        grid.appendChild(card);
    });

    // 3. Atualiza o contador de slots no topo da página
    const statusContador = document.querySelector('.vault-stats span');
    if(statusContador) {
        statusContador.innerHTML = `<i class="fas fa-users"></i> ${personagensSalvos.length} / 10 Slots`;
    }
}

// 4. Função para excluir o personagem
window.deletarPersonagem = function(index) {
    if (confirm("Tem certeza que deseja excluir este personagem para sempre?")) {
        personagensSalvos.splice(index, 1); // Remove o personagem da lista
        localStorage.setItem('amestia_personagens', JSON.stringify(personagensSalvos)); // Salva a nova lista no navegador
        renderCharacters(); // Atualiza a tela imediatamente
    }
};

// Carrega os personagens quando a página abrir
document.addEventListener('DOMContentLoaded', renderCharacters);
