/* =========================================================
   AMESTIA — PAINEL DO MESTRE
========================================================= */

(() => {

"use strict";


const FIREBASE_URL =
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const COLECAO =
    "campaigns";


const $ = id =>
    document.getElementById(id);



/* =========================================================
   FIREBASE
========================================================= */

function obterFirebase() {

    if (
        !window.AmestiaFirebase ||
        !window.AmestiaFirebase.db ||
        !window.AmestiaFirebase.auth
    ) {

        throw new Error(
            "Firebase ainda não foi carregado."
        );

    }

    return window.AmestiaFirebase;

}


function obterUsuario() {

    const usuario =
        obterFirebase()
            .auth
            .currentUser;


    if (!usuario) {

        throw new Error(
            "Você precisa estar conectado."
        );

    }

    return usuario;

}



/* =========================================================
   UTILIDADES
========================================================= */

function escaparHTML(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function numero(valor) {

    return Number(valor || 0);

}



/* =========================================================
   CARREGAR CAMPANHAS DO MESTRE
========================================================= */

async function carregarCampanhasDoMestre() {

    const firebase =
        obterFirebase();

    const usuario =
        obterUsuario();


    const {

        collection,
        query,
        where,
        getDocs

    } =
        await import(FIREBASE_URL);


    const referencia =
        collection(
            firebase.db,
            COLECAO
        );


    const consulta =
        query(
            referencia,
            where(
                "mestreId",
                "==",
                usuario.uid
            )
        );


    const resultado =
        await getDocs(
            consulta
        );


    const campanhas = [];


    resultado.forEach(
        documento => {

            campanhas.push({

                id:
                    documento.id,

                ...documento.data()

            });

        }
    );


    return campanhas;

}



/* =========================================================
   CARREGAR UMA CAMPANHA
========================================================= */

async function carregarCampanha(
    campanhaId
) {

    const firebase =
        obterFirebase();


    const {

        doc,
        getDoc

    } =
        await import(FIREBASE_URL);


    const referencia =
        doc(
            firebase.db,
            COLECAO,
            campanhaId
        );


    const resultado =
        await getDoc(
            referencia
        );


    if (
        !resultado.exists()
    ) {

        return null;

    }


    return {

        id:
            resultado.id,

        ...resultado.data()

    };

}



/* =========================================================
   VERIFICAR MESTRE
========================================================= */

async function verificarMestre(
    campanha
) {

    const usuario =
        obterUsuario();


    return (
        campanha &&
        campanha.mestreId ===
        usuario.uid
    );

}



/* =========================================================
   RESUMO DA CAMPANHA
========================================================= */

function renderizarResumo(
    campanha
) {

    const personagens =
        campanha.personagens ||
        [];

    const membros =
        campanha.membros ||
        [];


    const jogadores =
        Math.max(
            0,
            membros.length - 1
        );


    return `

        <div class="master-stat">

            <span class="master-stat-label">
                JOGADORES
            </span>

            <strong>
                ${jogadores}
            </strong>

        </div>


        <div class="master-stat">

            <span class="master-stat-label">
                PERSONAGENS
            </span>

            <strong>
                ${personagens.length}
            </strong>

        </div>


        <div class="master-stat">

            <span class="master-stat-label">
                SESSÕES
            </span>

            <strong>
                ${
                    (
                        campanha.sessoes ||
                        []
                    ).length
                }
            </strong>

        </div>


        <div class="master-stat">

            <span class="master-stat-label">
                STATUS
            </span>

            <strong>
                ${escaparHTML(
                    campanha.status ||
                    "ATIVA"
                )}
            </strong>

        </div>

    `;

}



/* =========================================================
   RENDERIZAR JOGADORES
========================================================= */

function renderizarJogadores(
    campanha
) {

    const membros =
        campanha.membros ||
        [];


    if (!membros.length) {

        return `

            <div class="empty-state">

                <p>
                    Nenhum participante encontrado.
                </p>

            </div>

        `;

    }


    return membros
        .map(
            membroId => {

                const mestre =
                    membroId ===
                    campanha.mestreId;


                const personagem =
                    (
                        campanha.personagens ||
                        []
                    )
                    .find(
                        item =>
                            item.jogadorId ===
                            membroId
                    );


                return `

                    <article
                        class="master-player-card"
                    >

                        <div class="master-player-icon">

                            ${
                                mestre
                                    ? "M"
                                    : "J"
                            }

                        </div>


                        <div class="master-player-info">

                            <span class="tag">

                                ${
                                    mestre
                                        ? "MESTRE"
                                        : "JOGADOR"
                                }

                            </span>


                            <h4>

                                ${
                                    personagem
                                        ? escaparHTML(
                                            personagem.jogadorNome
                                        )
                                        : (
                                            mestre
                                                ? "Mestre da campanha"
                                                : "Jogador"
                                        )
                                }

                            </h4>


                            ${
                                personagem
                                    ? `

                                        <p>
                                            Personagem:
                                            <strong>
                                                ${escaparHTML(
                                                    personagem.nome
                                                )}
                                            </strong>
                                        </p>

                                    `
                                    : `

                                        <p>
                                            Nenhuma ficha vinculada.
                                        </p>

                                    `
                            }

                        </div>


                        ${
                            personagem
                                ? `

                                    <button
                                        class="small-btn"
                                        data-master-character="${escaparHTML(
                                            personagem.fichaId
                                        )}"
                                        data-player-id="${escaparHTML(
                                            personagem.jogadorId
                                        )}"
                                    >
                                        Abrir ficha
                                    </button>

                                `
                                : ""

                        }

                    </article>

                `;

            }
        )
        .join("");

}



/* =========================================================
   RENDERIZAR PERSONAGENS
========================================================= */

function renderizarPersonagens(
    campanha
) {

    const personagens =
        campanha.personagens ||
        [];


    if (!personagens.length) {

        return `

            <div class="empty-state">

                <h3>
                    A mesa ainda está vazia.
                </h3>

                <p>
                    Os jogadores precisam vincular suas fichas à campanha.
                </p>

            </div>

        `;

    }


    return personagens
        .map(
            personagem => `

                <article
                    class="master-character-card"
                >

                    <div class="master-character-top">

                        <div>

                            <span class="tag">
                                PERSONAGEM
                            </span>

                            <h3>
                                ${escaparHTML(
                                    personagem.nome
                                )}
                            </h3>

                        </div>


                        <span class="character-status">
                            ATIVO
                        </span>

                    </div>


                    <div class="master-character-data">

                        <div>

                            <span>
                                JOGADOR
                            </span>

                            <strong>
                                ${escaparHTML(
                                    personagem.jogadorNome
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                LINHAGEM
                            </span>

                            <strong>
                                ${escaparHTML(
                                    personagem.linhagem ||
                                    "—"
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                ID DA FICHA
                            </span>

                            <strong>
                                ${escaparHTML(
                                    personagem.fichaId
                                )}
                            </strong>

                        </div>

                    </div>


                    <div class="card-actions">

                        <button
                            class="small-btn"
                            data-master-character="${escaparHTML(
                                personagem.fichaId
                            )}"
                            data-player-id="${escaparHTML(
                                personagem.jogadorId
                            )}"
                        >
                            Visualizar ficha
                        </button>


                        <button
                            class="small-btn"
                            data-master-character-notes="${escaparHTML(
                                personagem.jogadorId
                            )}"
                        >
                            Anotações
                        </button>

                    </div>

                </article>

            `
        )
        .join("");

}



/* =========================================================
   PAINEL PRINCIPAL
========================================================= */

async function abrirPainel(
    campanhaId
) {

    const campanha =
        await carregarCampanha(
            campanhaId
        );


    if (!campanha) {

        throw new Error(
            "Campanha não encontrada."
        );

    }


    const souMestre =
        await verificarMestre(
            campanha
        );


    if (!souMestre) {

        throw new Error(
            "Esta área é exclusiva do mestre."
        );

    }


    window.AmestiaMestrePainel = {

        campanhaAtual:
            campanha

    };


    renderizarPainel(
        campanha
    );

}



/* =========================================================
   RENDERIZAR PAINEL
========================================================= */

function renderizarPainel(
    campanha
) {

    const container =
        $("masterCampaignPanel");


    if (!container)
        return;


    container.innerHTML = `

        <div class="master-dashboard">


            <!-- ==========================================
                 CABEÇALHO
            =========================================== -->

            <header class="master-dashboard-header">

                <div>

                    <span class="tag">
                        ARQUIVO DO MESTRE
                    </span>

                    <h2>
                        ${escaparHTML(
                            campanha.nome
                        )}
                    </h2>

                    <p>
                        ${escaparHTML(
                            campanha.descricao ||
                            "Sem descrição."
                        )}
                    </p>

                </div>


                <div class="master-campaign-code">

                    <span>
                        CÓDIGO DA MESA
                    </span>

                    <strong>
                        ${escaparHTML(
                            campanha.codigo
                        )}
                    </strong>

                </div>

            </header>



            <!-- ==========================================
                 ESTATÍSTICAS
            =========================================== -->

            <section
                class="master-stats"
            >

                ${renderizarResumo(
                    campanha
                )}

            </section>



            <!-- ==========================================
                 MENU DO MESTRE
            =========================================== -->

            <nav class="master-dashboard-nav">

                <button
                    class="master-tab active"
                    data-master-tab="overview"
                >
                    Visão geral
                </button>

                <button
                    class="master-tab"
                    data-master-tab="players"
                >
                    Jogadores
                </button>

                <button
                    class="master-tab"
                    data-master-tab="characters"
                >
                    Personagens
                </button>

                <button
                    class="master-tab"
                    data-master-tab="sessions"
                >
                    Sessões
                </button>

                <button
                    class="master-tab"
                    data-master-tab="tools"
                >
                    Ferramentas
                </button>

            </nav>



            <!-- ==========================================
                 VISÃO GERAL
            =========================================== -->

            <section
                class="master-tab-content active"
                data-master-content="overview"
            >

                <div class="master-section-grid">


                    <section class="panel">

                        <span class="tag">
                            CAMPANHA
                        </span>

                        <h3>
                            Estado da mesa
                        </h3>

                        <p>
                            A campanha está
                            ${
                                campanha.status ===
                                "ativa"
                                    ? "ativa"
                                    : "marcada como " +
                                      escaparHTML(
                                          campanha.status
                                      )
                            }.
                        </p>

                    </section>


                    <section class="panel">

                        <span class="tag">
                            PRÓXIMA ETAPA
                        </span>

                        <h3>
                            Preparação
                        </h3>

                        <p>
                            Use as ferramentas do mestre
                            para preparar a próxima sessão.
                        </p>

                    </section>


                </div>


                <section class="panel">

                    <div class="section-heading">

                        <span class="tag">
                            MESA
                        </span>

                        <h3>
                            Personagens presentes
                        </h3>

                    </div>


                    <div class="master-character-grid">

                        ${renderizarPersonagens(
                            campanha
                        )}

                    </div>

                </section>

            </section>



            <!-- ==========================================
                 JOGADORES
            =========================================== -->

            <section
                class="master-tab-content"
                data-master-content="players"
            >

                <section class="panel">

                    <div class="section-heading">

                        <span class="tag">
                            PARTICIPANTES
                        </span>

                        <h3>
                            Jogadores da mesa
                        </h3>

                    </div>


                    <div class="master-player-list">

                        ${renderizarJogadores(
                            campanha
                        )}

                    </div>

                </section>

            </section>



            <!-- ==========================================
                 PERSONAGENS
            =========================================== -->

            <section
                class="master-tab-content"
                data-master-content="characters"
            >

                <section class="panel">

                    <div class="section-heading">

                        <span class="tag">
                            FICHAS
                        </span>

                        <h3>
                            Personagens da campanha
                        </h3>

                        <p>
                            Aqui o mestre poderá acompanhar
                            os personagens vinculados à mesa.
                        </p>

                    </div>


                    <div class="master-character-grid">

                        ${renderizarPersonagens(
                            campanha
                        )}

                    </div>

                </section>

            </section>



            <!-- ==========================================
                 SESSÕES
            =========================================== -->

            <section
                class="master-tab-content"
                data-master-content="sessions"
            >

                <section class="panel">

                    <div class="section-heading">

                        <span class="tag">
                            CAMPANHA
                        </span>

                        <h3>
                            Sessões
                        </h3>

                    </div>


                    <div class="empty-state">

                        <h3>
                            Nenhuma sessão registrada.
                        </h3>

                        <p>
                            O sistema de sessões será conectado
                            ao diário da campanha no próximo módulo.
                        </p>

                    </div>

                </section>

            </section>



            <!-- ==========================================
                 FERRAMENTAS
            =========================================== -->

            <section
                class="master-tab-content"
                data-master-content="tools"
            >

                <div class="master-tools-grid">


                    <button
                        class="master-tool-card"
                        data-master-tool="dice"
                    >

                        <span>
                            🎲
                        </span>

                        <strong>
                            Dados
                        </strong>

                        <small>
                            Rolar testes e consultar resultados.
                        </small>

                    </button>


                    <button
                        class="master-tool-card"
                        data-master-tool="clock"
                    >

                        <span>
                            ◷
                        </span>

                        <strong>
                            Relógio das Sombras
                        </strong>

                        <small>
                            Controlar ameaças e consequências.
                        </small>

                    </button>


                    <button
                        class="master-tool-card"
                        data-master-tool="veil"
                    >

                        <span>
                            ◈
                        </span>

                        <strong>
                            Densidade do Véu
                        </strong>

                        <small>
                            Controlar a intensidade sobrenatural.
                        </small>

                    </button>


                    <button
                        class="master-tool-card"
                        data-master-tool="combat"
                    >

                        <span>
                            ⚔
                        </span>

                        <strong>
                            Combate
                        </strong>

                        <small>
                            Preparar encontros e iniciativa.
                        </small>

                    </button>


                </div>

            </section>


        </div>

    `;


    configurarAbasMestre();

}



/* =========================================================
   ABAS DO PAINEL
========================================================= */

function configurarAbasMestre() {

    document
        .querySelectorAll(
            "[data-master-tab]"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        const alvo =
                            botao.dataset.masterTab;


                        document
                            .querySelectorAll(
                                "[data-master-tab]"
                            )
                            .forEach(
                                item =>
                                    item.classList
                                        .remove(
                                            "active"
                                        )
                            );


                        document
                            .querySelectorAll(
                                "[data-master-content]"
                            )
                            .forEach(
                                item =>
                                    item.classList
                                        .remove(
                                            "active"
                                        )
                            );


                        botao.classList.add(
                            "active"
                        );


                        const conteudo =
                            document.querySelector(
                                `[data-master-content="${alvo}"]`
                            );


                        if (conteudo) {

                            conteudo.classList.add(
                                "active"
                            );

                        }

                    }
                );

            }
        );

}



/* =========================================================
   VISUALIZAR FICHA
========================================================= */

async function visualizarFicha(
    fichaId,
    jogadorId
) {

    if (!fichaId) {

        alert(
            "Esta ficha não possui um identificador válido."
        );

        return;

    }


    /*
     * Primeiro tentamos utilizar o sistema de fichas
     * que já existe no projeto.
     */

    if (
        window.AmestiaFicha &&
        typeof
        window.AmestiaFicha.carregarFichaFirebase ===
        "function"
    ) {

        try {

            const ficha =
                await
                window.AmestiaFicha
                    .carregarFichaFirebase(
                        fichaId
                    );


            if (ficha) {

                window.AmestiaMestrePainel.fichaAtual =
                    ficha;


                /*
                 * Se o seu app já possui uma função
                 * para renderizar fichas, aproveitamos.
                 */

                if (
                    typeof window.renderizarFichaVisual ===
                    "function"
                ) {

                    window.renderizarFichaVisual(
                        ficha
                    );

                    return;

                }


                if (
                    typeof window.preencherFicha ===
                    "function"
                ) {

                    window.preencherFicha(
                        ficha
                    );

                    return;

                }

            }

        }
        catch (erro) {

            console.warn(
                "Não foi possível abrir pela API de fichas:",
                erro
            );

        }

    }


    /*
     * Fallback:
     * abre a ficha diretamente no Firestore.
     */

    try {

        const firebase =
            obterFirebase();


        const {

            doc,
            getDoc

        } =
            await import(FIREBASE_URL);


        const referencia =
            doc(
                firebase.db,
                "users",
                jogadorId,
                "characters",
                fichaId
            );


        const resultado =
            await getDoc(
                referencia
            );


        if (
            !resultado.exists()
        ) {

            throw new Error(
                "A ficha não foi encontrada."
            );

        }


        const ficha = {

            id:
                resultado.id,

            ...resultado.data()

        };


        window.AmestiaMestrePainel.fichaAtual =
            ficha;


        renderizarFichaMestre(
            ficha
        );

    }
    catch (erro) {

        console.error(
            erro
        );


        alert(
            erro.message
        );

    }

}



/* =========================================================
   VISUALIZAÇÃO DE FICHA DO MESTRE
========================================================= */

function renderizarFichaMestre(
    ficha
) {

    const container =
        $("masterCharacterViewer");


    if (!container)
        return;


    container.innerHTML = `

        <div class="master-sheet">

            <div class="master-sheet-header">

                <div>

                    <span class="tag">
                        FICHA DO PERSONAGEM
                    </span>

                    <h2>
                        ${escaparHTML(
                            ficha.nome ||
                            "Sem nome"
                        )}
                    </h2>

                    <p>
                        Visualização do mestre
                    </p>

                </div>

            </div>


            <div class="master-sheet-grid">


                <div class="master-sheet-block">

                    <span>
                        LINHAGEM
                    </span>

                    <strong>
                        ${escaparHTML(
                            ficha.linhagem ||
                            "—"
                        )}
                    </strong>

                </div>


                <div class="master-sheet-block">

                    <span>
                        VIDA
                    </span>

                    <strong>
                        ${
                            numero(
                                ficha.vidaAtual ??
                                ficha.pvAtual
                            )
                        }
                        /
                        ${
                            numero(
                                ficha.vidaMaxima ??
                                ficha.pvMaximo
                            )
                        }
                    </strong>

                </div>


                <div class="master-sheet-block">

                    <span>
                        FLUXO
                    </span>

                    <strong>
                        ${
                            numero(
                                ficha.fluxoAtual
                            )
                        }
                        /
                        ${
                            numero(
                                ficha.fluxoMaximo
                            )
                        }
                    </strong>

                </div>


                <div class="master-sheet-block">

                    <span>
                        SANIDADE
                    </span>

                    <strong>
                        ${
                            numero(
                                ficha.sanidadeAtual
                            )
                        }
                        /
                        ${
                            numero(
                                ficha.sanidadeMaxima
                            )
                        }
                    </strong>

                </div>

            </div>


            <section>

                <span class="tag">
                    ATRIBUTOS
                </span>

                <div class="master-attributes">

                    ${renderizarAtributos(
                        ficha
                    )}

                </div>

            </section>


            <section>

                <span class="tag">
                    INFORMAÇÕES
                </span>

                <div class="master-sheet-info">

                    <p>
                        <strong>
                            Ocupação:
                        </strong>

                        ${escaparHTML(
                            ficha.ocupacao ||
                            ficha.profissao ||
                            "—"
                        )}
                    </p>


                    <p>
                        <strong>
                            Habilidade inata:
                        </strong>

                        ${escaparHTML(
                            ficha.habilidadeInata ||
                            "—"
                        )}
                    </p>

                </div>

            </section>


            <div class="card-actions">

                <button
                    class="small-btn"
                    id="btnFecharFichaMestre"
                >
                    Fechar ficha
                </button>

            </div>

        </div>

    `;


    container.classList.add(
        "active"
    );


    const fechar =
        $("btnFecharFichaMestre");


    if (fechar) {

        fechar.addEventListener(
            "click",
            () => {

                container.classList.remove(
                    "active"
                );

                container.innerHTML =
                    "";

            }
        );

    }

}



/* =========================================================
   ATRIBUTOS
========================================================= */

function renderizarAtributos(
    ficha
) {

    const atributos = [

        [
            "Cognição",
            "cognicao"
        ],

        [
            "Percepção",
            "percepcao"
        ],

        [
            "Vontade",
            "vontade"
        ],

        [
            "Vigor",
            "vigor"
        ],

        [
            "Agilidade",
            "agilidade"
        ],

        [
            "Presença",
            "presenca"
        ]

    ];


    return atributos
        .map(
            ([nome, chave]) => `

                <div class="master-attribute">

                    <span>
                        ${nome}
                    </span>

                    <strong>
                        ${
                            ficha.atributos?.[chave] ??
                            ficha[chave] ??
                            0
                        }
                    </strong>

                </div>

            `
        )
        .join("");

}



/* =========================================================
   FERRAMENTAS
========================================================= */

function configurarFerramentas() {

    document.addEventListener(
        "click",
        evento => {

            const botao =
                evento.target.closest(
                    "[data-master-tool]"
                );


            if (!botao)
                return;


            const ferramenta =
                botao.dataset.masterTool;


            /*
             * Esses módulos serão conectados
             * posteriormente.
             */

            const mensagens = {

                dice:
                    "O módulo de dados será aberto aqui.",

                clock:
                    "O Relógio das Sombras será aberto aqui.",

                veil:
                    "A Densidade do Véu será aberta aqui.",

                combat:
                    "O módulo de combate será aberto aqui."

            };


            alert(
                mensagens[ferramenta] ||
                "Ferramenta ainda não configurada."
            );

        }
    );

}



/* =========================================================
   EVENTOS DE FICHA
========================================================= */

function configurarEventosFicha() {

    document.addEventListener(
        "click",
        evento => {

            const botao =
                evento.target.closest(
                    "[data-master-character]"
                );


            if (!botao)
                return;


            visualizarFicha(

                botao.dataset.masterCharacter,

                botao.dataset.playerId

            );

        }
    );

}



/* =========================================================
   API
========================================================= */

window.AmestiaMestrePainel = {

    carregarCampanhasDoMestre,

    carregarCampanha,

    abrirPainel,

    renderizarPainel,

    visualizarFicha,

    fichaAtual:
        null,

    campanhaAtual:
        null

};



/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function iniciar() {

    configurarFerramentas();

    configurarEventosFicha();

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciar
    );

}
else {

    iniciar();

}

})();