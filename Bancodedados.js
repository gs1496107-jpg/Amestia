// ==========================================
// BANCO DE DADOS SIMULADO (MOCK)
// ==========================================
const bancoDeDadosInfo = [
    {
        id: "v01",
        categoria: "Raça",
        titulo: "Hereditário Vampírico",
        resumo: "Humanos que carregam o traço genético distorcido de um ancestral sedento.",
        imagem: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500",
        lore: "Muitos não são monstros completos, mas sofrem com a aversão ao Sol e a necessidade fisiológica de consumir ferro cru através do sangue. A linhagem vampírica nas cidades sob o Véu costuma formar sindicatos próprios.",
        historia: "A primeira manifestação da mutação ocorreu em 1892, logo após a Queda Prateada...",
        relacionamentos: ["Inimigos de: A Ordem do Sol Frio", "Aliados de: Guilda dos Sangue-Ralo"],
        regras: "Vantagem em Percepção no escuro. Fraqueza: Toma dano dobrado para fontes de luz intensa (fogo ou luz do véu). Precisa ingerir sangue a cada 3 dias ou perde 1 Ponto de Vigor.",
        tabelaHtml: `<tr><th>Fase da Fome</th><th>Penalidade</th></tr>
                     <tr><td>1 Dia</td><td>Nenhuma</td></tr>
                     <tr><td>3 Dias</td><td>-1 Vigor, Tremores</td></tr>
                     <tr><td>7 Dias</td><td>Frenesi (Perde controle do PC)</td></tr>`,
        itensRelacionados: ["Ampola de Hemoglobina", "Manto de Sombras"],
        tagsBusca: ["vampiro", "raça", "sangue", "mordida"]
    },
    {
        id: "v02",
        categoria: "Criaturas",
        titulo: "Vampiro Anômalo",
        resumo: "Uma anomalia pura que simula lendas urbanas para atrair presas.",
        imagem: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500",
        lore: "Ao contrário dos hereditários, o Vampiro Anômalo não é humano. É uma manifestação de energia do Akedonte que assumiu a forma de um predador noturno baseado no medo coletivo da humanidade.",
        historia: "Registrado pela primeira vez nos esgotos da Nova Capital.",
        relacionamentos: ["Criado por: Akedonte", "Caça: Qualquer ser vivo"],
        regras: "Imune a armas convencionais. Só recebe dano letal de Prata ou Relíquias. Ataque: 'Abraço Gélido' (Dano: 2d6 + Drenar Sanidade).",
        tabelaHtml: `<tr><th>Atributo</th><th>Valor</th></tr>
                     <tr><td>Vitalidade</td><td>45</td></tr>
                     <tr><td>Ameaça</td><td>Alta</td></tr>`,
        itensRelacionados: ["Estaca de Prata Pura", "Sangue Sombrio"],
        tagsBusca: ["vampiro", "criatura", "monstro", "anomalia", "akedonte"]
    },
    {
        id: "v03",
        categoria: "Relíquias",
        titulo: "Cálice de Sangue Sombrio",
        resumo: "Um cálice que converte sangue normal em essência de cura, muito usado por vampiros.",
        imagem: "https://images.unsplash.com/photo-1590059530491-d28c310469b8?w=500",
        lore: "Encontrado nas ruínas de um monastério corrompido, este cálice de ferro negro pulsa com uma temperatura morna.",
        historia: "Recuperado na Campanha 'Ecos de Sal e Sangue' pelo Investigador Arthur.",
        relacionamentos: ["Pertenceu a: Conde Valerius"],
        regras: "Gaste 1 Ação e 2 de Vida para encher o cálice. Quem beber recupera 10 de Sanidade e 5 de Vida.",
        tabelaHtml: `<tr><th>Efeito</th><th>Custo</th></tr>
                     <tr><td>Cura Mental</td><td>2 PV</td></tr>`,
        itensRelacionados: ["Hereditário Vampírico", "Artefatos do Véu"],
        tagsBusca: ["vampiro", "reliquia", "calice", "cura", "sangue"]
    },
    {
        id: "v04",
        categoria: "Campanhas",
        titulo: "Ecos de Sal e Sangue",
        resumo: "A campanha onde um sindicato vampírico controla as docas.",
        imagem: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=500",
        lore: "Os jogadores investigam estranhos desaparecimentos de marinheiros. O que parecia contrabando logo se revela uma operação de colheita de sangue.",
        historia: "Campanha ativa do Mestre Guardião.",
        relacionamentos: ["Vilão Principal: Silas (Vampiro)"],
        regras: "Nível sugerido: Investigadores Grau 2.",
        tabelaHtml: `<tr><th>Local Principal</th><th>Foco</th></tr>
                     <tr><td>Docas Antigas</td><td>Investigação/Combate</td></tr>`,
        itensRelacionados: ["Vampiro Anômalo", "Cálice de Sangue Sombrio"],
        tagsBusca: ["vampiro", "campanha", "docas", "sangue", "ecos"]
    }
];

// ==========================================
// CONTROLE DE TELAS
// ==========================================
const categoryView = document.getElementById('categoryView');
const searchResultsView = document.getElementById('searchResultsView');
const entryView = document.getElementById('entryView');

function esconderTudo() {
    categoryView.classList.remove('active');
    searchResultsView.classList.remove('active');
    entryView.classList.remove('active');
}

function voltarParaCategorias() {
    esconderTudo();
    categoryView.classList.add('active');
    document.getElementById('searchInput').value = ""; // Limpa a barra
}

function voltarParaResultados() {
    esconderTudo();
    searchResultsView.classList.add('active');
}

// ==========================================
// MOTOR DE PESQUISA INTELIGENTE
// ==========================================
function verificarPesquisa(event) {
    if (event.key === "Enter") {
        executarPesquisa();
    }
}

function executarPesquisa() {
    const termo = document.getElementById('searchInput').value.toLowerCase().trim();
    if (termo === "") return;

    // Filtra o banco de dados pelas tags ou título
    const resultadosEncontrados = bancoDeDadosInfo.filter(item => 
        item.titulo.toLowerCase().includes(termo) || 
        item.tagsBusca.some(tag => tag.includes(termo))
    );

    document.getElementById('termoPesquisado').innerText = termo;
    renderizarResultados(resultadosEncontrados);

    esconderTudo();
    searchResultsView.classList.add('active');
}

function renderizarResultados(resultados) {
    const container = document.getElementById('resultadosContainer');
    container.innerHTML = "";

    if (resultados.length === 0) {
        container.innerHTML = "<p>Nenhum registro encontrado no Banco de Dados do Véu.</p>";
        return;
    }

    // Organizar resultados por Categoria
    const resultadosPorCategoria = {};
    
    resultados.forEach(item => {
        if (!resultadosPorCategoria[item.categoria]) {
            resultadosPorCategoria[item.categoria] = [];
        }
        resultadosPorCategoria[item.categoria].push(item);
    });

    // Criar o HTML na tela separado por categoria
    for (const [categoria, itens] of Object.entries(resultadosPorCategoria)) {
        const catTitle = document.createElement('h3');
        catTitle.className = 'results-category';
        catTitle.innerText = `${categoria} (${itens.length})`;
        container.appendChild(catTitle);

        // Lista de itens dentro da categoria
        itens.forEach(item => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-item';
            resultDiv.innerHTML = `<h4>${item.titulo}</h4><p>${item.resumo}</p>`;
            resultDiv.onclick = () => abrirPaginaItem(item.id);
            container.appendChild(resultDiv);
        });
    }
}

// ==========================================
// FILTRO POR CATEGORIA (CLIQUE NOS CARDS)
// ==========================================
function filtrarPorCategoria(categoriaClicada) {
    // Filtra o banco de dados buscando a categoria exata (ignorando maiúsculas e minúsculas para segurança)
    const resultadosEncontrados = bancoDeDadosInfo.filter(item => 
        item.categoria.toLowerCase() === categoriaClicada.toLowerCase()
    );

    // Atualiza o título na tela de resultados
    document.getElementById('termoPesquisado').innerText = `Categoria: ${categoriaClicada}`;
    
    // Usa a mesma função de renderizar que já criamos para a pesquisa
    renderizarResultados(resultadosEncontrados);

    // Esconde os cards e mostra a lista de resultados
    esconderTudo();
    searchResultsView.classList.add('active');
}

// ==========================================
// RENDERIZAÇÃO DA PÁGINA DO ITEM (WIKI)
// ==========================================
function abrirPaginaItem(idItem) {
    const item = bancoDeDadosInfo.find(i => i.id === idItem);
    if (!item) return;

    // Preenche os dados
    document.getElementById('entryImage').src = item.imagem;
    document.getElementById('entryCategory').innerText = item.categoria;
    document.getElementById('entryTitle').innerText = item.titulo;
    document.getElementById('entryLore').innerText = item.lore;
    document.getElementById('entryHistory').innerText = item.historia;
    document.getElementById('entryRules').innerText = item.regras;
    
    // Tabela
    document.getElementById('entryTable').innerHTML = item.tabelaHtml;

    // Lista de Relacionamentos
    const relList = document.getElementById('entryRelationships');
    relList.innerHTML = "";
    item.relacionamentos.forEach(rel => {
        const li = document.createElement('li');
        li.innerHTML = rel;
        relList.appendChild(li);
    });

    // Tags de Itens Relacionados
    const tagsContainer = document.getElementById('entryRelatedItems');
    tagsContainer.innerHTML = "";
    item.itensRelacionados.forEach(tagText => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.innerText = tagText;
        tagsContainer.appendChild(span);
    });

    // Troca de tela
    esconderTudo();
    entryView.classList.add('active');
}

// ==========================================
// RENDERIZAÇÃO DA PÁGINA DO ITEM (WIKI)
// ==========================================
function abrirPaginaItem(idItem) {
    const item = bancoDeDadosInfo.find(i => i.id === idItem);
    if (!item) return;

    // Preenche os dados
    document.getElementById('entryImage').src = item.imagem;
    document.getElementById('entryCategory').innerText = item.categoria;
    document.getElementById('entryTitle').innerText = item.titulo;
    document.getElementById('entryLore').innerText = item.lore;
    document.getElementById('entryHistory').innerText = item.historia;
    document.getElementById('entryRules').innerText = item.regras;
    
    // Tabela
    document.getElementById('entryTable').innerHTML = item.tabelaHtml;

    // Lista de Relacionamentos
    const relList = document.getElementById('entryRelationships');
    relList.innerHTML = "";
    item.relacionamentos.forEach(rel => {
        const li = document.createElement('li');
        li.innerHTML = rel; // Aqui daria para usar split(':') para deixar negrito, mas simplificamos
        relList.appendChild(li);
    });

    // Tags de Itens Relacionados
    const tagsContainer = document.getElementById('entryRelatedItems');
    tagsContainer.innerHTML = "";
    item.itensRelacionados.forEach(tagText => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.innerText = tagText;
        tagsContainer.appendChild(span);
    });

    // Troca de tela
    esconderTudo();
    entryView.classList.add('active');
}
