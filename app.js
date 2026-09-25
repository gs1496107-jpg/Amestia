/* =========================================================
   AMESTIA — APLICAÇÃO PRINCIPAL
========================================================= */

(() => {

"use strict";


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const KEY =
    "amestia_fichas_v3";


/*
   Cache local da sessão.

   O armazenamento definitivo das fichas
   fica no Firebase / Firestore.
*/
let fichasCache = [];

let ficha =
    AmestiaFicha.criarFicha();

let usuarioFirebase =
    null;

let modoEdicao =
    false;


const $ =
    id =>
        document.getElementById(id);



/* =========================================================
   NAVEGAÇÃO
========================================================= */

function abrirAba(id) {

    document
        .querySelectorAll(".tab")
        .forEach(tab => {

            tab.classList.remove(
                "active"
            );

        });


    const alvo =
        $(id);


    if (!alvo)
        return;


    alvo.classList.add(
        "active"
    );


    document
        .querySelectorAll(".nav-item")
        .forEach(botao => {

            botao.classList.toggle(
                "active",
                botao.dataset.tab === id
            );

        });


    $("sidebar")
        ?.classList.remove(
            "open"
        );


    if (id === "progressao")
        renderizarProgressao();


    if (id === "caminhos")
        renderizarCaminhos();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


document.addEventListener(
    "click",
    evento => {

        const botao =
            evento.target.closest(
                "[data-tab]"
            );


        if (!botao)
            return;


        abrirAba(
            botao.dataset.tab
        );

    }
);



/* =========================================================
   ATRIBUTOS
========================================================= */

function construirAtributos() {

    const container =
        $("attrGrid");


    if (!container)
        return;


    container.innerHTML =
        Object.entries(
            AMESTIA.atributos
        )
        .map(
            ([id, atributo]) => {

                return `

                    <div class="attr-box">

                        <b>
                            ${atributo.nome}
                        </b>

                        <input
                            type="number"
                            min="0"
                            max="4"
                            value="${
                                ficha.atributos[id] || 0
                            }"
                            data-atributo="${id}"
                        >

                    </div>

                `;

            }
        )
        .join("");


    container
        .querySelectorAll(
            "[data-atributo]"
        )
        .forEach(input => {

            input.addEventListener(
                "input",
                () => {

                    ficha.atributos[
                        input.dataset.atributo
                    ] =
                        Math.max(
                            0,
                            Math.min(
                                4,
                                Number(
                                    input.value
                                ) || 0
                            )
                        );


                    input.value =
                        ficha.atributos[
                            input.dataset.atributo
                        ];


                    recalcular();

                }
            );

        });

}



/* =========================================================
   PERÍCIAS
========================================================= */

function construirPericias() {

    const container =
        $("skillGrid");


    if (!container)
        return;


    container.innerHTML =
        AMESTIA.pericias
        .map(
            ([nome, atributo]) => {

                const valor =
                    ficha.pericias[nome] || 0;


                return `

                    <div class="skill-row">

                        <div>

                            <span>
                                ${nome}
                            </span>

                            <small>
                                ${
                                    AMESTIA
                                        .atributos[
                                            atributo
                                        ].nome
                                }
                            </small>

                        </div>


                        <input
                            type="number"
                            min="0"
                            max="3"
                            value="${valor}"
                            data-pericia="${nome}"
                        >

                    </div>

                `;

            }
        )
        .join("");


    container
        .querySelectorAll(
            "[data-pericia]"
        )
        .forEach(input => {

            input.addEventListener(
                "input",
                () => {

                    ficha.pericias[
                        input.dataset.pericia
                    ] =
                        Math.max(
                            0,
                            Math.min(
                                3,
                                Number(
                                    input.value
                                ) || 0
                            )
                        );


                    recalcular();

                }
            );

        });

}



/* =========================================================
   LINHAGENS
========================================================= */

function construirLinhagens() {

    const select =
        $("linhagem");


    if (select) {

        select.innerHTML = `

            <option value="">
                Selecione...
            </option>

            ${
                AMESTIA.linhagens
                .map(
                    linhagem => `

                        <option
                            value="${linhagem.id}"
                        >
                            ${linhagem.nome}
                        </option>

                    `
                )
                .join("")
            }

        `;

    }


    const grid =
        $("lineageGrid");


    if (!grid)
        return;


    grid.innerHTML =
        AMESTIA.linhagens
        .map(
            linhagem => `

                <article class="catalog-card">

                    <span class="tag">
                        LINHAGEM
                    </span>

                    <h3>
                        ${linhagem.nome}
                    </h3>

                    <p>
                        <strong>
                            ${linhagem.tipo}
                        </strong>
                    </p>

                    <p>
                        ${linhagem.descricao}
                    </p>

                    <p>
                        ${linhagem.especializacoes}
                    </p>

                </article>

            `
        )
        .join("");

}



/* =========================================================
   CAMPOS DA FICHA
========================================================= */

const campos = [

    "nome",
    "jogador",
    "idade",
    "historico",
    "descricao",

    "ancora1Nome",
    "ancora1Desc",

    "ancora2Nome",
    "ancora2Desc",

    "ancora3Nome",
    "ancora3Desc",

    "gatilho",
    "efeito",
    "tributo",

    "equipamento",

    "pvAtual",
    "estabilidadeAtual",
    "fluxoAtual",

    "pro",
    "xp"

];


function configurarCampos() {

    campos.forEach(id => {

        const elemento =
            $(id);


        if (!elemento)
            return;


        elemento.addEventListener(
            "input",
            () => {

                let valor =
                    elemento.value;


                if (
                    elemento.type ===
                    "number"
                ) {

                    valor =
                        Number(
                            valor || 0
                        );

                }


                ficha[id] =
                    valor;


                if (
                    [
                        "pro",
                        "xp",
                        "pvAtual",
                        "estabilidadeAtual",
                        "fluxoAtual"
                    ]
                    .includes(id)
                ) {

                    atualizarRecursos();

                }

            }
        );

    });


    $("linhagem")
        ?.addEventListener(
            "change",
            evento => {

                ficha.linhagem =
                    evento.target.value;


                atualizarLinhagem();

                recalcular();

            }
        );


    $("guia")
        ?.addEventListener(
            "change",
            evento => {

                ficha.guia =
                    evento.target.value;


                recalcular();

            }
        );

}



/* =========================================================
   RECÁLCULO
========================================================= */

function recalcular() {

    const derivados =
        AmestiaFicha.calcular(
            ficha
        );


    if ($("pvMax"))
        $("pvMax").textContent =
            derivados.pv;


    if ($("estabilidadeMax"))
        $("estabilidadeMax")
            .textContent =
                derivados.estabilidade;


    if ($("fluxoMax"))
        $("fluxoMax")
            .textContent =
                derivados.fluxo;


    if ($("defesa"))
        $("defesa")
            .textContent =
                derivados.defesa;


    if ($("iniciativa"))
        $("iniciativa")
            .textContent =
                `1d20 + ${derivados.iniciativa}`;


    if ($("movimento"))
        $("movimento")
            .textContent =
                `${derivados.movimento} m`;


    if ($("fluxoFormula")) {

        const atributoGuia =
            AMESTIA.atributos[
                ficha.guia
            ];


        $("fluxoFormula")
            .textContent =
                atributoGuia
                    ? `10 + ${atributoGuia.nome} × 2`
                    : "Selecione um Guia";

    }


    const totalA =
        AmestiaFicha
            .totalAtributos(
                ficha
            );


    const totalP =
        AmestiaFicha
            .totalPericias(
                ficha
            );


    if ($("attrNotice")) {

        $("attrNotice")
            .textContent =
                `${totalA}/9 pontos distribuídos.`;

        $("attrNotice")
            .classList.toggle(
                "bad",
                totalA > 9
            );

    }


    const limitePericia =
        ficha.linhagem === "humano"
            ? 18
            : 15;


    if ($("skillNotice")) {

        $("skillNotice")
            .textContent =
                `${totalP}/${limitePericia} pontos distribuídos.`;

        $("skillNotice")
            .classList.toggle(
                "bad",
                totalP > limitePericia
            );

    }


    atualizarRecursos();

}



/* =========================================================
   LINHAGEM
========================================================= */

function atualizarLinhagem() {

    const linhagem =
        AMESTIA.linhagens.find(
            x =>
                x.id ===
                ficha.linhagem
        );


    if ($("lineageTitle"))
        $("lineageTitle")
            .textContent =
                linhagem
                    ? linhagem.nome
                    : "Nenhuma";


    if ($("lineageText"))
        $("lineageText")
            .textContent =
                linhagem
                    ? linhagem.descricao
                    : "Selecione uma linhagem.";

}



/* =========================================================
   RECURSOS
========================================================= */

function atualizarRecursos() {

    const derivados =
        AmestiaFicha.calcular(
            ficha
        );


    const pv =
        $("pvAtual");

    if (pv) {

        pv.max =
            derivados.pv;

        if (
            Number(pv.value) >
            derivados.pv
        )
            pv.value =
                derivados.pv;

    }


    const estabilidade =
        $("estabilidadeAtual");

    if (estabilidade) {

        estabilidade.max =
            derivados.estabilidade;

        if (
            Number(estabilidade.value) >
            derivados.estabilidade
        )
            estabilidade.value =
                derivados.estabilidade;

    }


    const fluxo =
        $("fluxoAtual");

    if (fluxo) {

        fluxo.max =
            derivados.fluxo;

        if (
            Number(fluxo.value) >
            derivados.fluxo
        )
            fluxo.value =
                derivados.fluxo;

    }


    const progressPRO =
        $("progressPRO");

    if (progressPRO)
        progressPRO.textContent =
            ficha.pro || 0;


    const graus =
        ficha.caminhosGrauIII ||
        [];


    if ($("progressIII"))
        $("progressIII")
            .textContent =
                `${graus.length}/2`;


    if ($("grausIII"))
        $("grausIII")
            .textContent =
                `${graus.length}/2`;

}



/* =========================================================
   CAMINHOS
========================================================= */

function renderizarCaminhos() {

    const container =
        $("pathGrid");


    if (!container)
        return;


    const pesquisa =
        (
            $("pathSearch")
                ?.value || ""
        )
        .toLowerCase();


    const filtroElemento =
        $("pathFilter") ||
        $("pathGradeFilter");


    const grauFiltro =
        filtroElemento?.value ||
        "all";


    container.innerHTML =
        CAMINHOS
        .filter(
            caminho => {

                const caminhoMatch =
                    caminho.nome
                        .toLowerCase()
                        .includes(
                            pesquisa
                        ) ||
                    caminho.conceito
                        .toLowerCase()
                        .includes(
                            pesquisa
                        );


                const habilidadeMatch =
                    Object.values(
                        caminho.graus
                    )
                    .flat()
                    .some(
                        habilidade =>
                            habilidade.nome
                                .toLowerCase()
                                .includes(
                                    pesquisa
                                )
                    );


                return (
                    caminhoMatch ||
                    habilidadeMatch
                );

            }
        )
        .map(
            caminho =>
                renderCardCaminho(
                    caminho,
                    grauFiltro
                )
        )
        .join("");

}



function renderCardCaminho(
    caminho,
    filtro
) {

    let html = `

        <article class="path-card">

            <div class="path-card-head">

                <div>

                    <span class="tag">
                        CAMINHO ${caminho.id}
                    </span>

                    <h3>
                        ${caminho.nome}
                    </h3>

                    <p>
                        ${caminho.conceito}
                    </p>

                </div>

            </div>

            <div class="path-skills">

    `;


    ["I", "II", "III"]
        .forEach(
            grau => {

                if (
                    filtro !== "all" &&
                    filtro !== grau
                )
                    return;


                const habilidades =
                    caminho.graus[grau];


                if (!habilidades)
                    return;


                html += `

                    <div class="grade-section">

                        <h4>
                            Grau ${grau}
                            ·
                            ${
                                AMESTIA
                                    .graus[
                                        grau
                                    ].nome
                            }
                        </h4>

                `;


                habilidades.forEach(
                    habilidade => {

                        html += `

                            <div class="ability-card">

                                <strong>
                                    ${habilidade.nome}
                                </strong>

                                <p>
                                    ${habilidade.texto}
                                </p>

                                <small>
                                    ${
                                        AMESTIA
                                            .graus[
                                                grau
                                            ].custo
                                    }
                                    PRO
                                </small>

                            </div>

                        `;

                    }
                );


                html += `
                    </div>
                `;

            }
        );


    html += `
            </div>
        </article>
    `;


    return html;

}



/* =========================================================
   PROGRESSÃO
========================================================= */

function renderizarProgressao() {

    const container =
        $("progressPathGrid");


    if (!container)
        return;


    const habilidadesFicha =
        ficha.habilidades ||
        [];


    container.innerHTML =
        CAMINHOS
        .map(
            caminho => {

                const habilidades =
                    habilidadesFicha
                    .filter(
                        x =>
                            Number(
                                x.caminhoId
                            ) ===
                            Number(
                                caminho.id
                            )
                    );


                return `

                    <article class="progress-path-card">

                        <div>

                            <span class="tag">
                                CAMINHO ${caminho.id}
                            </span>

                            <h3>
                                ${caminho.nome}
                            </h3>

                            <p>
                                ${habilidades.length}
                                habilidades adquiridas
                            </p>

                        </div>


                        <div class="progress-actions">

                            ${renderBotoesCompra(
                                caminho,
                                "I"
                            )}

                            ${renderBotoesCompra(
                                caminho,
                                "II"
                            )}

                            ${renderBotoesCompra(
                                caminho,
                                "III"
                            )}

                        </div>


                        <div class="owned-skills">

                            ${
                                habilidades.length
                                    ? habilidades
                                        .map(
                                            h => `

                                                <div>
                                                    <b>
                                                        Grau ${h.grau}
                                                    </b>

                                                    ${h.nome}
                                                </div>

                                            `
                                        )
                                        .join("")
                                    : `

                                        <span>
                                            Nenhuma habilidade adquirida.
                                        </span>

                                    `
                            }

                        </div>

                    </article>

                `;

            }
        )
        .join("");

}



function renderBotoesCompra(
    caminho,
    grau
) {

    const habilidades =
        caminho.graus[grau];


    if (!habilidades)
        return "";


    return `

        <button
            class="btn ghost"
            data-buy-path="${caminho.id}"
            data-buy-grade="${grau}"
        >

            Adquirir Grau ${grau}

            ·

            ${
                AMESTIA
                    .graus[
                        grau
                    ].custo
            }

            PRO

        </button>

    `;

}



/* =========================================================
   COMPRA DE HABILIDADE
========================================================= */

document.addEventListener(
    "click",
    async evento => {

        const botao =
            evento.target.closest(
                "[data-buy-path]"
            );


        if (!botao)
            return;


        const caminho =
            CAMINHOS.find(
                x =>
                    Number(x.id) ===
                    Number(
                        botao.dataset.buyPath
                    )
            );


        if (!caminho)
            return;


        const grau =
            botao.dataset.buyGrade;


        const habilidades =
            caminho.graus[grau];


        const proxima =
            habilidades.find(
                habilidade =>
                    !(ficha.habilidades || [])
                    .some(
                        h =>
                            h.caminhoId ===
                            caminho.id &&
                            h.grau ===
                            grau &&
                            h.nome ===
                            habilidade.nome
                    )
            );


        if (!proxima) {

            alert(
                "Você já possui todas as habilidades deste Grau."
            );

            return;

        }


        const resultado =
            AmestiaFicha.comprar(
                ficha,
                caminho,
                proxima,
                grau
            );


        if (!resultado.permitido) {

            alert(
                resultado.motivo
            );

            return;

        }


        const salvo =
            await salvarAutomaticamente();


        if (!salvo)
            return;


        renderizarProgressao();

        atualizarRecursos();


        alert(
            `${proxima.nome} adquirida.`
        );

    }
);



/* =========================================================
   REGRAS
========================================================= */

function construirRegras() {

    const nav =
        $("ruleNav");


    if (!nav)
        return;


    nav.innerHTML =
        AMESTIA.regras
        .map(
            (regra, index) => `

                <button
                    class="${
                        index === 0
                            ? "active"
                            : ""
                    }"
                    data-regra="${index}"
                >
                    ${regra.nome}
                </button>

            `
        )
        .join("");


    function mostrar(index) {

        nav
            .querySelectorAll("button")
            .forEach(
                button =>
                    button.classList.toggle(
                        "active",
                        Number(
                            button.dataset.regra
                        ) === index
                    )
            );


        if ($("ruleContent"))
            $("ruleContent")
                .innerHTML =
                    AMESTIA
                        .regras[
                            index
                        ].texto;

    }


    nav
        .querySelectorAll("button")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        mostrar(
                            Number(
                                button.dataset.regra
                            )
                        );

                    }
                );

            }
        );


    mostrar(0);

}



/* =========================================================
   BIBLIOTECA
========================================================= */

function construirBiblioteca() {

    const capitulos = [

        [
            "Capítulo 1",
            "Aqueles que Resistem",
            "Criação de investigadores, histórico, linhagem, atributos, perícias e Habilidade Única."
        ],

        [
            "Capítulo 2",
            "As Regras de Amestia",
            "Testes, ações, investigação, Relógio das Sombras e Densidade do Véu."
        ],

        [
            "Capítulo 3",
            "O Investigador",
            "Construção do personagem e Caminhos."
        ],

        [
            "Capítulo 4",
            "As Âncoras e o Véu",
            "Identidade, ruptura e estabilidade."
        ],

        [
            "Capítulo 5",
            "O Akedonte e as Entidades",
            "Entidades, ameaças e bestiário."
        ],

        [
            "Capítulo 6",
            "Organizações e Fachada Social",
            "Organizações que existem por trás da normalidade."
        ],

        [
            "Capítulo 7",
            "Constelações e Divindades Caídas",
            "Constelações, divindades e fragmentos."
        ],

        [
            "Capítulo 8",
            "Arsenal, Itens e Ferramentas",
            "Armas, equipamentos, veículos e artefatos."
        ],

        [
            "Capítulo 9",
            "Progressão, Recursos e Economia",
            "POT, PRO, XP e evolução."
        ],

        [
            "Capítulo 10",
            "A Arte do Horror e da Condução",
            "Tom, horror e condução."
        ],

        [
            "Capítulo 11",
            "Regras Expandidas para o Mestre",
            "Investigação, pressão e preparação."
        ],

        [
            "Capítulo 12–13",
            "Aventuras e Campanhas",
            "Aventura introdutória e campanhas longas."
        ]

    ];


    const grid =
        $("libraryGrid");


    if (!grid)
        return;


    grid.innerHTML =
        capitulos
        .map(
            capitulo => `

                <article class="library-card">

                    <span class="tag">
                        ${capitulo[0]}
                    </span>

                    <h3>
                        ${capitulo[1]}
                    </h3>

                    <p>
                        ${capitulo[2]}
                    </p>

                </article>

            `
        )
        .join("");

}



/* =========================================================
   COLETAR FICHA
========================================================= */

function coletarFicha() {

    campos.forEach(id => {

        const elemento =
            $(id);


        if (!elemento)
            return;


        ficha[id] =
            elemento.type === "number"
                ? Number(
                    elemento.value || 0
                )
                : elemento.value;

    });


    if ($("guia"))
        ficha.guia =
            $("guia").value;


    if ($("linhagem"))
        ficha.linhagem =
            $("linhagem").value;


    return ficha;

}



/* =========================================================
   SALVAR NO FIREBASE
========================================================= */

async function salvarAutomaticamente() {

    try {

        if (
            !window.AmestiaFirebase ||
            !window.AmestiaFirebase.auth
        ) {

            throw new Error(
                "Firebase ainda não foi carregado."
            );

        }


        const usuario =
            window.AmestiaFirebase
                .auth
                .currentUser;


        if (!usuario) {

            alert(
                "Entre com sua conta Google antes de salvar a ficha."
            );

            return false;

        }


        if (!ficha.id) {

            ficha.id =
                (
                    typeof crypto !== "undefined" &&
                    typeof crypto.randomUUID ===
                    "function"
                )
                    ? crypto.randomUUID()
                    : (
                        Date.now()
                        .toString(36) +
                        Math.random()
                            .toString(36)
                            .slice(2)
                    );

        }


        ficha.donoId =
            usuario.uid;


        await AmestiaFicha
            .salvarNoFirebase(
                ficha
            );


        const indice =
            fichasCache.findIndex(
                x =>
                    x.id === ficha.id
            );


        const copia =
            JSON.parse(
                JSON.stringify(
                    ficha
                )
            );


        if (indice === -1) {

            fichasCache.push(
                copia
            );

        }
        else {

            fichasCache[indice] =
                copia;

        }


        renderizarFichas();


        console.log(
            "Ficha salva no Firestore:",
            ficha.id
        );


        return true;

    }
    catch (erro) {

        console.error(
            "Erro ao salvar ficha:",
            erro
        );


        alert(
            "Não foi possível salvar a ficha no Firebase.\n\n" +
            erro.message
        );


        return false;

    }

}



/* =========================================================
   SALVAR FICHA
========================================================= */

async function salvarFicha() {

    if (
        !validarFichaAntesDeSalvar()
    )
        return;


    coletarFicha();


    const derivados =
        AmestiaFicha.calcular(
            ficha
        );


    if (
        ficha.pvAtual ===
        undefined ||
        ficha.pvAtual ===
        null
    )
        ficha.pvAtual =
            derivados.pv;


    if (
        ficha.estabilidadeAtual ===
        undefined ||
        ficha.estabilidadeAtual ===
        null
    )
        ficha.estabilidadeAtual =
            derivados.estabilidade;


    if (
        ficha.fluxoAtual ===
        undefined ||
        ficha.fluxoAtual ===
        null
    )
        ficha.fluxoAtual =
            derivados.fluxo;


    const salva =
        await salvarAutomaticamente();


    if (!salva)
        return;


    preencherFicha();


    if (
        typeof renderizarFichaVisual ===
        "function"
    )
        renderizarFichaVisual();


    alert(
        "Ficha salva no Firebase."
    );

}



/* =========================================================
   CARREGAR FICHAS
========================================================= */

function carregarFichas() {

    return fichasCache;

}



/* =========================================================
   SINCRONIZAR FICHAS COM FIREBASE
========================================================= */

async function sincronizarFichasFirebase() {

    try {

        if (
            !window.AmestiaFirebase ||
            !window.AmestiaFirebase.auth
        ) {

            console.warn(
                "Firebase ainda não disponível."
            );

            return [];

        }


        const usuario =
            window.AmestiaFirebase
                .auth
                .currentUser;


        if (!usuario) {

            fichasCache =
                [];

            renderizarFichas();

            return [];

        }


        usuarioFirebase =
            usuario;


        const fichas =
            await AmestiaFicha
                .carregarDoFirebase();


        fichasCache =
            Array.isArray(fichas)
                ? fichas
                : [];


        renderizarFichas();


        if (
            fichasCache.length > 0
        ) {

            const atual =
                fichasCache.find(
                    x =>
                        x.id === ficha.id
                );


            if (atual) {

                ficha =
                    JSON.parse(
                        JSON.stringify(
                            atual
                        )
                    );

            }
            else {

                ficha =
                    JSON.parse(
                        JSON.stringify(
                            fichasCache[
                                fichasCache.length - 1
                            ]
                        )
                    );

            }


            preencherFicha();


            if (
                typeof renderizarFichaVisual ===
                "function"
            )
                renderizarFichaVisual();

        }


        console.log(
            "Fichas sincronizadas:",
            fichasCache.length
        );


        return fichasCache;

    }
    catch (erro) {

        console.error(
            "Erro ao carregar fichas do Firebase:",
            erro
        );


        fichasCache =
            [];


        renderizarFichas();


        return [];

    }

}



/* =========================================================
   RENDERIZAR FICHAS
========================================================= */

function renderizarFichas() {

    const container =
        $("savedSheets");


    if (!container)
        return;


    const fichas =
        carregarFichas();


    if (
        fichas.length ===
        0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    Nenhuma ficha salva.
                </h3>

                <p>
                    Crie um investigador para começar.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        fichas
        .slice()
        .reverse()
        .map(
            x => `

                <article class="saved-card">

                    <span class="tag">
                        ${x.linhagem || "SEM LINHAGEM"}
                    </span>

                    <h3>
                        ${x.nome || "Sem nome"}
                    </h3>

                    <p>
                        Vigor:
                        ${x.atributos?.vigor || 0}
                    </p>

                    <p>
                        Agilidade:
                        ${x.atributos?.agilidade || 0}
                    </p>

                    <p>
                        Cognição:
                        ${x.atributos?.cognicao || 0}
                    </p>


                    <div class="card-actions">

                        <button
                            type="button"
                            class="small-btn"
                            data-open="${x.id}"
                        >
                            Abrir
                        </button>


                        <button
                            type="button"
                            class="small-btn danger"
                            data-delete="${x.id}"
                        >
                            Excluir
                        </button>

                    </div>

                </article>

            `
        )
        .join("");

}



/* =========================================================
   ABRIR / EXCLUIR FICHA
========================================================= */

document.addEventListener(
    "click",
    async evento => {

        const abrir =
            evento.target.closest(
                "[data-open]"
            );


        if (abrir) {

            const encontrada =
                carregarFichas()
                    .find(
                        x =>
                            x.id ===
                            abrir.dataset.open
                    );


            if (!encontrada)
                return;


            ficha =
                JSON.parse(
                    JSON.stringify(
                        encontrada
                    )
                );


            preencherFicha();


            if (
                typeof renderizarFichaVisual ===
                "function"
            )
                renderizarFichaVisual();


            abrirAba(
                "ficha"
            );


            return;

        }


        const excluir =
            evento.target.closest(
                "[data-delete]"
            );


        if (!excluir)
            return;


        if (
            !confirm(
                "Excluir esta ficha permanentemente?"
            )
        )
            return;


        const id =
            excluir.dataset.delete;


        try {

            await AmestiaFicha
                .excluirDoFirebase(
                    id
                );


            fichasCache =
                fichasCache.filter(
                    x =>
                        x.id !== id
                );


            if (
                ficha.id === id
            ) {

                ficha =
                    AmestiaFicha
                        .criarFicha();


                preencherFicha();

            }


            renderizarFichas();


            console.log(
                "Ficha excluída do Firebase:",
                id
            );

        }
        catch (erro) {

            console.error(
                "Erro ao excluir ficha:",
                erro
            );


            alert(
                "Não foi possível excluir a ficha.\n\n" +
                erro.message
            );

        }

    }
);



/* =========================================================
   PREENCHER FICHA
========================================================= */

function preencherFicha() {

    campos.forEach(id => {

        const elemento =
            $(id);


        if (!elemento)
            return;


        elemento.value =
            ficha[id] ??
            "";

    });


    if ($("guia"))
        $("guia").value =
            ficha.guia ||
            "cognicao";


    if ($("linhagem"))
        $("linhagem").value =
            ficha.linhagem ||
            "";


    construirAtributos();

    construirPericias();

    atualizarLinhagem();

    recalcular();

    renderizarProgressao();

}



/* =========================================================
   NOVA FICHA
========================================================= */

function novaFicha() {

    if (
        ficha &&
        ficha.nome &&
        !confirm(
            "Criar uma nova ficha? Alterações não salvas serão perdidas."
        )
    )
        return;


    ficha =
        AmestiaFicha.criarFicha();


    preencherFicha();


    prepararCriacao();

}



/* =========================================================
   ESCAPAR TEXTO
========================================================= */

function escapar(valor) {

    return String(
        valor ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



/* =========================================================
   NOME DOS ATRIBUTOS
========================================================= */

function formatarNomeAtributo(id) {

    const nomes = {

        cognicao:
            "Cognição",

        percepcao:
            "Percepção",

        vontade:
            "Vontade",

        vigor:
            "Vigor",

        agilidade:
            "Agilidade",

        presenca:
            "Presença"

    };


    return nomes[id] ||
        id;

}



/* =========================================================
   FICHA VISUAL
========================================================= */

function abrirFichaVisual() {

    modoEdicao =
        false;


    moverEditor(
        false
    );


    renderizarFichaVisual();


    abrirAba(
        "ficha"
    );

}



function renderizarFichaVisual() {

    const viewer =
        $("sheetViewer");


    if (!viewer)
        return;


    const atributos =
        ficha.atributos ||
        {};


    const pericias =
        ficha.pericias ||
        {};


    const habilidades =
        ficha.habilidades ||
        [];


    const derivados =
        AmestiaFicha.calcular(
            ficha
        );


    viewer.innerHTML = `

        <div class="sheet-header">

            <div>

                <span class="tag">
                    FICHA DE PERSONAGEM
                </span>

                <h2>
                    ${escapar(
                        ficha.nome ||
                        "Personagem sem nome"
                    )}
                </h2>

                <p>
                    Jogador:
                    ${escapar(
                        ficha.jogador ||
                        "Não informado"
                    )}
                </p>

            </div>


            <div class="sheet-header-actions">

                <button
                    type="button"
                    class="btn primary"
                    id="editSheet"
                >
                    Editar ficha
                </button>

            </div>

        </div>


        <div class="sheet-overview">

            <div class="sheet-main-info">

                <div class="sheet-info-card">

                    <span>
                        Linhagem
                    </span>

                    <strong>
                        ${escapar(
                            ficha.linhagem ||
                            "—"
                        )}
                    </strong>

                </div>


                <div class="sheet-info-card">

                    <span>
                        Guia
                    </span>

                    <strong>
                        ${escapar(
                            ficha.guia ||
                            "—"
                        )}
                    </strong>

                </div>


                <div class="sheet-info-card">

                    <span>
                        Idade
                    </span>

                    <strong>
                        ${escapar(
                            ficha.idade ??
                            "—"
                        )}
                    </strong>

                </div>

            </div>


            <div class="sheet-resources">

                <div class="resource-card">

                    <span>
                        Vida
                    </span>

                    <strong>
                        ${
                            ficha.pvAtual ??
                            derivados.pv
                        }
                        /
                        ${derivados.pv}
                    </strong>

                </div>


                <div class="resource-card">

                    <span>
                        Estabilidade
                    </span>

                    <strong>
                        ${
                            ficha.estabilidadeAtual ??
                            derivados.estabilidade
                        }
                        /
                        ${derivados.estabilidade}
                    </strong>

                </div>


                <div class="resource-card">

                    <span>
                        Fluxo
                    </span>

                    <strong>
                        ${
                            ficha.fluxoAtual ??
                            derivados.fluxo
                        }
                        /
                        ${derivados.fluxo}
                    </strong>

                </div>

            </div>

        </div>


        <section class="sheet-section">

            <div class="section-heading">

                <span class="tag">
                    ATRIBUTOS
                </span>

                <h3>
                    Capacidades
                </h3>

            </div>


            <div class="attribute-grid">

                ${
                    Object.entries(
                        atributos
                    )
                    .map(
                        ([id, valor]) => `

                            <div class="attribute-card">

                                <span>
                                    ${formatarNomeAtributo(
                                        id
                                    )}
                                </span>

                                <strong>
                                    ${valor ?? 0}
                                </strong>

                            </div>

                        `
                    )
                    .join("")
                }

            </div>

        </section>


        <section class="sheet-section">

            <div class="section-heading">

                <span class="tag">
                    PERÍCIAS
                </span>

                <h3>
                    Especializações
                </h3>

            </div>


            <div class="skill-view-grid">

                ${
                    Object.entries(
                        pericias
                    )
                    .map(
                        ([nome, valor]) => `

                            <div class="skill-view-card">

                                <span>
                                    ${escapar(
                                        nome
                                    )}
                                </span>

                                <strong>
                                    ${valor ?? 0}
                                </strong>

                            </div>

                        `
                    )
                    .join("")
                }

            </div>

        </section>


        <section class="sheet-section">

            <div class="section-heading">

                <span class="tag">
                    DESCRIÇÃO
                </span>

                <h3>
                    Histórico e identidade
                </h3>

            </div>


            <div class="sheet-text-grid">

                <article class="sheet-text-card">

                    <span>
                        Histórico
                    </span>

                    <p>
                        ${escapar(
                            ficha.historico ||
                            "Nenhum histórico registrado."
                        )}
                    </p>

                </article>


                <article class="sheet-text-card">

                    <span>
                        Descrição
                    </span>

                    <p>
                        ${escapar(
                            ficha.descricao ||
                            "Nenhuma descrição registrada."
                        )}
                    </p>

                </article>

            </div>

        </section>


        <section class="sheet-section">

            <div class="section-heading">

                <span class="tag">
                    ÂNCORAS
                </span>

                <h3>
                    Vínculos
                </h3>

            </div>


            <div class="anchors-view-grid">

                ${
                    [1, 2, 3]
                    .map(
                        numero => {

                            const nome =
                                ficha[
                                    `ancora${numero}Nome`
                                ];


                            const desc =
                                ficha[
                                    `ancora${numero}Desc`
                                ];


                            if (
                                !nome &&
                                !desc
                            )
                                return "";


                            return `

                                <article class="anchor-view-card">

                                    <strong>
                                        ${escapar(
                                            nome ||
                                            `Âncora ${numero}`
                                        )}
                                    </strong>

                                    <p>
                                        ${escapar(
                                            desc ||
                                            ""
                                        )}
                                    </p>

                                </article>

                            `;

                        }
                    )
                    .join("")
                }

            </div>

        </section>


        <section class="sheet-section">

            <div class="section-heading">

                <span class="tag">
                    HABILIDADES
                </span>

                <h3>
                    Caminhos adquiridos
                </h3>

            </div>


            <div class="abilities-view-grid">

                ${
                    habilidades.length
                        ? habilidades
                            .map(
                                habilidade => `

                                    <article class="ability-view-card">

                                        <div>

                                            <span class="tag">
                                                Grau
                                                ${escapar(
                                                    habilidade.grau
                                                )}
                                            </span>

                                            <h4>
                                                ${escapar(
                                                    habilidade.nome
                                                )}
                                            </h4>

                                        </div>


                                        <p>
                                            ${escapar(
                                                habilidade.texto ||
                                                ""
                                            )}
                                        </p>

                                    </article>

                                `
                            )
                            .join("")
                        : `

                            <div class="panel">

                                <p>
                                    Nenhuma habilidade adquirida.
                                </p>

                            </div>

                        `
                }

            </div>

        </section>


        <section class="sheet-section">

            <div class="section-heading">

                <span class="tag">
                    OUTROS
                </span>

                <h3>
                    Equipamento e habilidade única
                </h3>

            </div>


            <div class="sheet-text-grid">

                <article class="sheet-text-card">

                    <span>
                        Equipamento
                    </span>

                    <p>
                        ${escapar(
                            ficha.equipamento ||
                            "Nenhum equipamento registrado."
                        )}
                    </p>

                </article>


                <article class="sheet-text-card">

                    <span>
                        Habilidade única
                    </span>

                    <p>
                        ${escapar(
                            ficha.efeito ||
                            "Nenhuma habilidade registrada."
                        )}
                    </p>

                </article>

            </div>

        </section>

    `;


    $("editSheet")
        ?.addEventListener(
            "click",
            entrarEdicaoDireta
        );

}



/* =========================================================
   MOVER EDITOR
========================================================= */

function moverEditor(
    paraFicha
) {

    const editor =
        $("editorBundle");


    const criacao =
        $("criar-personagem");


    const mount =
        $("sheetEditorMount");


    if (!editor)
        return;


    if (
        paraFicha &&
        mount
    ) {

        mount.appendChild(
            editor
        );


        editor.hidden =
            false;


        if (criacao)
            criacao.classList.remove(
                "editor-has-content"
            );

    }
    else if (criacao) {

        criacao.appendChild(
            editor
        );


        editor.hidden =
            false;

    }

}



/* =========================================================
   EDIÇÃO DIRETA
========================================================= */

function entrarEdicaoDireta() {

    modoEdicao =
        true;


    moverEditor(
        true
    );


    const viewer =
        $("sheetViewer");


    if (viewer)
        viewer.hidden =
            true;


    const mount =
        $("sheetEditorMount");


    if (mount)
        mount.hidden =
            false;


    abrirAba(
        "ficha"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



/* =========================================================
   SAIR DA EDIÇÃO
========================================================= */

async function sairEdicaoDireta(
    salvar = true
) {

    if (salvar) {

        if (
            !validarFichaAntesDeSalvar()
        )
            return false;


        coletarFicha();


        const salvo =
            await salvarAutomaticamente();


        if (!salvo)
            return false;

    }


    modoEdicao =
        false;


    moverEditor(
        false
    );


    const mount =
        $("sheetEditorMount");


    if (mount)
        mount.hidden =
            true;


    const viewer =
        $("sheetViewer");


    if (viewer)
        viewer.hidden =
            false;


    renderizarFichaVisual();


    return true;

}



/* =========================================================
   VALIDAR FICHA
========================================================= */

function validarFichaAntesDeSalvar() {

    coletarFicha();


    const totalA =
        AmestiaFicha.totalAtributos(
            ficha
        );


    const totalP =
        AmestiaFicha.totalPericias(
            ficha
        );


    const limite =
        ficha.linhagem === "humano"
            ? 18
            : 15;


    if (totalA > 9) {

        alert(
            "Você ultrapassou os 9 pontos de Atributo."
        );

        return false;

    }


    if (totalP > limite) {

        alert(
            `Você ultrapassou o limite de ${limite} pontos de Perícia.`
        );

        return false;

    }


    return true;

}



/* =========================================================
   PREPARAR CRIAÇÃO
========================================================= */

function prepararCriacao() {

    modoEdicao =
        true;


    moverEditor(
        false
    );


    const viewer =
        $("sheetViewer");


    if (viewer)
        viewer.hidden =
            true;


    const mount =
        $("sheetEditorMount");


    if (mount)
        mount.hidden =
            true;


    const editor =
        $("editorBundle");


    if (editor)
        editor.hidden =
            false;


    abrirAba(
        "criar-personagem"
    );

}



/* =========================================================
   TELAS DE FICHA
========================================================= */

function configurarTelasDeFicha() {

    $("editSheet")
        ?.addEventListener(
            "click",
            entrarEdicaoDireta
        );


    $("backToSheets")
        ?.addEventListener(
            "click",
            () =>
                abrirAba(
                    "fichas"
                )
        );


    $("newSheet")
        ?.addEventListener(
            "click",
            () => {

                ficha =
                    AmestiaFicha.criarFicha();


                preencherFicha();


                prepararCriacao();

            }
        );


    $("saveSheet")
        ?.addEventListener(
            "click",
            salvarFicha
        );


    $("cancelEditSheet")
        ?.addEventListener(
            "click",
            () =>
                sairEdicaoDireta(
                    false
                )
        );

}



/* =========================================================
   PESQUISA DOS CAMINHOS
========================================================= */

$("pathSearch")
    ?.addEventListener(
        "input",
        renderizarCaminhos
    );


const filtroCaminhos =
    $("pathFilter") ||
    $("pathGradeFilter");


filtroCaminhos
    ?.addEventListener(
        "change",
        renderizarCaminhos
    );



/* =========================================================
   INTERFACE
========================================================= */

function configurarInterface() {

    $("newSheet")
        ?.addEventListener(
            "click",
            novaFicha
        );


    $("menuBtn")
        ?.addEventListener(
            "click",
            () => {

                $("sidebar")
                    ?.classList.toggle(
                        "open"
                    );

            }
        );

}



/* =========================================================
   INICIALIZAÇÃO
========================================================= */

async function iniciar() {

    console.log(
        "AMÉSTIA: iniciando aplicação..."
    );


    construirAtributos();

    construirPericias();

    construirLinhagens();

    construirRegras();

    construirBiblioteca();

    configurarCampos();

    configurarInterface();

    configurarTelasDeFicha();


    preencherFicha();

    renderizarFichas();

    renderizarCaminhos();


    /*
       Firebase
    */

    if (
        window.AmestiaFirebase &&
        window.AmestiaFirebase.auth
    ) {

        window.AmestiaFirebase
            .auth
            .onAuthStateChanged(
                async usuario => {

                    usuarioFirebase =
                        usuario ||
                        null;


                    if (usuario) {

                        console.log(
                            "Usuário conectado:",
                            usuario.email
                        );


                        await sincronizarFichasFirebase();

                    }
                    else {

                        console.log(
                            "Nenhum usuário conectado."
                        );


                        fichasCache =
                            [];


                        renderizarFichas();

                    }

                }
            );

    }
    else {

        console.warn(
            "Firebase ainda não está disponível."
        );

    }


    if (
        typeof renderizarFichaVisual ===
        "function"
    )
        renderizarFichaVisual();


    if (
        typeof AmestiaMestre !==
        "undefined" &&
        AmestiaMestre &&
        typeof AmestiaMestre.iniciar ===
        "function"
    ) {

        AmestiaMestre.iniciar();

    }


    console.log(
        "AMÉSTIA: aplicação pronta."
    );

}


document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


/* =========================================================
   EXPOR FUNÇÕES
========================================================= */

window.AmestiaApp = {

    abrirAba,

    novaFicha,

    salvarFicha,

    renderizarFichas,

    renderizarCaminhos,

    renderizarProgressao,

    renderizarFichaVisual,

    sincronizarFichasFirebase,

    getFicha:
        () => ficha,

    getUsuario:
        () => usuarioFirebase

};


})();