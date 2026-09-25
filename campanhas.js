/* =========================================================
   AMESTIA — CAMPANHAS
   Sistema de campanhas + fichas vinculadas
========================================================= */

(() => {

"use strict";


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const COLECAO =
    "campaigns";


const FIREBASE_URL =
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const $ = id =>
    document.getElementById(id);



/* =========================================================
   FIREBASE
========================================================= */

function firebase() {

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


function usuarioAtual() {

    const usuario =
        firebase().auth.currentUser;


    if (!usuario) {

        throw new Error(
            "Você precisa estar conectado à sua conta."
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


function gerarCodigo() {

    const caracteres =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


    let codigo = "";


    for (let i = 0; i < 6; i++) {

        codigo +=
            caracteres[
                Math.floor(
                    Math.random() *
                    caracteres.length
                )
            ];

    }


    return codigo;

}



/* =========================================================
   CRIAR CAMPANHA
========================================================= */

async function criar(nome, descricao = "") {

    const f =
        firebase();


    const usuario =
        usuarioAtual();


    nome =
        String(nome || "").trim();


    descricao =
        String(descricao || "").trim();


    if (!nome) {

        throw new Error(
            "Digite o nome da campanha."
        );

    }


    const {

        collection,
        addDoc,
        query,
        where,
        getDocs,
        serverTimestamp

    } =
        await import(FIREBASE_URL);


    const campanhas =
        collection(
            f.db,
            COLECAO
        );


    let codigo;
    let livre = false;


    for (let tentativa = 0; tentativa < 10; tentativa++) {

        codigo =
            gerarCodigo();


        const consulta =
            query(
                campanhas,
                where(
                    "codigo",
                    "==",
                    codigo
                )
            );


        const resultado =
            await getDocs(
                consulta
            );


        if (resultado.empty) {

            livre = true;

            break;

        }

    }


    if (!livre) {

        throw new Error(
            "Não foi possível gerar um código único."
        );

    }


    const dados = {

        nome,

        descricao,

        codigo,

        mestreId:
            usuario.uid,

        mestreNome:
            usuario.displayName ||
            usuario.email ||
            "Mestre",

        mestreEmail:
            usuario.email ||
            "",

        membros: [
            usuario.uid
        ],

        personagens: [],

        sessoes: [],

        notas: [],

        criadoEm:
            serverTimestamp(),

        atualizadoEm:
            serverTimestamp(),

        status:
            "ativa"

    };


    const referencia =
        await addDoc(
            campanhas,
            dados
        );


    return {

        id:
            referencia.id,

        ...dados,

        codigo

    };

}



/* =========================================================
   CARREGAR CAMPANHA
========================================================= */

async function carregar(id) {

    const f =
        firebase();


    const {

        doc,
        getDoc

    } =
        await import(FIREBASE_URL);


    const referencia =
        doc(
            f.db,
            COLECAO,
            id
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
   MINHAS CAMPANHAS
========================================================= */

async function minhas() {

    const f =
        firebase();


    const usuario =
        usuarioAtual();


    const {

        collection,
        query,
        where,
        getDocs

    } =
        await import(FIREBASE_URL);


    const consulta =
        query(
            collection(
                f.db,
                COLECAO
            ),
            where(
                "membros",
                "array-contains",
                usuario.uid
            )
        );


    const resultado =
        await getDocs(
            consulta
        );


    const lista = [];


    resultado.forEach(
        documento => {

            lista.push({

                id:
                    documento.id,

                ...documento.data()

            });

        }
    );


    lista.sort(
        (a, b) => {

            const A =
                a.criadoEm?.seconds || 0;

            const B =
                b.criadoEm?.seconds || 0;

            return B - A;

        }
    );


    return lista;

}



/* =========================================================
   BUSCAR POR CÓDIGO
========================================================= */

async function buscarPorCodigo(
    codigo
) {

    const f =
        firebase();


    codigo =
        String(
            codigo || ""
        )
        .trim()
        .toUpperCase();


    if (!codigo) {

        throw new Error(
            "Digite o código da campanha."
        );

    }


    const {

        collection,
        query,
        where,
        getDocs

    } =
        await import(FIREBASE_URL);


    const consulta =
        query(
            collection(
                f.db,
                COLECAO
            ),
            where(
                "codigo",
                "==",
                codigo
            )
        );


    const resultado =
        await getDocs(
            consulta
        );


    if (
        resultado.empty
    ) {

        return null;

    }


    const documento =
        resultado.docs[0];


    return {

        id:
            documento.id,

        ...documento.data()

    };

}



/* =========================================================
   ENTRAR NA CAMPANHA
========================================================= */

async function entrar(
    codigo
) {

    const f =
        firebase();


    const usuario =
        usuarioAtual();


    const campanha =
        await buscarPorCodigo(
            codigo
        );


    if (!campanha) {

        throw new Error(
            "Campanha não encontrada."
        );

    }


    if (
        campanha.mestreId ===
        usuario.uid
    ) {

        return campanha;

    }


    const {

        doc,
        updateDoc,
        arrayUnion,
        serverTimestamp

    } =
        await import(FIREBASE_URL);


    await updateDoc(

        doc(
            f.db,
            COLECAO,
            campanha.id
        ),

        {

            membros:
                arrayUnion(
                    usuario.uid
                ),

            atualizadoEm:
                serverTimestamp()

        }

    );


    return await carregar(
        campanha.id
    );

}



/* =========================================================
   SAIR DA CAMPANHA
========================================================= */

async function sair(
    campanhaId
) {

    const f =
        firebase();


    const usuario =
        usuarioAtual();


    const campanha =
        await carregar(
            campanhaId
        );


    if (!campanha) {

        throw new Error(
            "Campanha não encontrada."
        );

    }


    if (
        campanha.mestreId ===
        usuario.uid
    ) {

        throw new Error(
            "O mestre não pode sair da própria campanha."
        );

    }


    const {

        doc,
        updateDoc,
        arrayRemove,
        serverTimestamp

    } =
        await import(FIREBASE_URL);


    await updateDoc(

        doc(
            f.db,
            COLECAO,
            campanhaId
        ),

        {

            membros:
                arrayRemove(
                    usuario.uid
                ),

            atualizadoEm:
                serverTimestamp()

        }

    );


    return true;

}



/* =========================================================
   ATUALIZAR CAMPANHA
========================================================= */

async function atualizar(
    campanhaId,
    dados
) {

    const f =
        firebase();


    const usuario =
        usuarioAtual();


    const campanha =
        await carregar(
            campanhaId
        );


    if (!campanha) {

        throw new Error(
            "Campanha não encontrada."
        );

    }


    if (
        campanha.mestreId !==
        usuario.uid
    ) {

        throw new Error(
            "Somente o mestre pode alterar esta campanha."
        );

    }


    const {

        doc,
        updateDoc,
        serverTimestamp

    } =
        await import(FIREBASE_URL);


    await updateDoc(

        doc(
            f.db,
            COLECAO,
            campanhaId
        ),

        {

            ...dados,

            atualizadoEm:
                serverTimestamp()

        }

    );


    return true;

}



/* =========================================================
   VINCULAR FICHA
========================================================= */

async function vincularFicha(
    campanhaId,
    ficha
) {

    const usuario =
        usuarioAtual();


    const campanha =
        await carregar(
            campanhaId
        );


    if (!campanha) {

        throw new Error(
            "Campanha não encontrada."
        );

    }


    const membro =
        (
            campanha.membros ||
            []
        )
        .includes(
            usuario.uid
        );


    if (!membro) {

        throw new Error(
            "Você não participa desta campanha."
        );

    }


    if (!ficha || !ficha.id) {

        throw new Error(
            "Ficha inválida."
        );

    }


    const personagem = {

        fichaId:
            ficha.id,

        jogadorId:
            usuario.uid,

        jogadorNome:
            usuario.displayName ||
            usuario.email ||
            "Jogador",

        jogadorEmail:
            usuario.email ||
            "",

        nome:
            ficha.nome ||
            "Sem nome",

        linhagem:
            ficha.linhagem ||
            "",

        vinculadoEm:
            new Date().toISOString(),

        atualizadoEm:
            new Date().toISOString()

    };


    /*
     * Um jogador pode ter somente uma ficha
     * ativa por campanha.
     */

    const personagens =
        (
            campanha.personagens ||
            []
        )
        .filter(
            existente =>
                existente.jogadorId !==
                usuario.uid
        );


    personagens.push(
        personagem
    );


    await atualizar(

        campanhaId,

        {
            personagens
        }

    );


    return personagem;

}



/* =========================================================
   DESVINCULAR FICHA
========================================================= */

async function desvincularFicha(
    campanhaId
) {

    const usuario =
        usuarioAtual();


    const campanha =
        await carregar(
            campanhaId
        );


    if (!campanha) {

        throw new Error(
            "Campanha não encontrada."
        );

    }


    const personagens =
        (
            campanha.personagens ||
            []
        )
        .filter(
            personagem =>
                personagem.jogadorId !==
                usuario.uid
        );


    await atualizar(

        campanhaId,

        {
            personagens
        }

    );


    return true;

}



/* =========================================================
   OBTER FICHAS DO USUÁRIO
========================================================= */

async function obterMinhasFichas() {

    /*
     * Primeiro tentamos usar o sistema de fichas
     * que já existe no projeto.
     */

    if (
        window.AmestiaFicha &&
        typeof
        window.AmestiaFicha.carregarDoFirebase ===
        "function"
    ) {

        try {

            const fichas =
                await
                window.AmestiaFicha
                    .carregarDoFirebase();


            if (
                Array.isArray(fichas)
            ) {

                return fichas;

            }

        }
        catch (erro) {

            console.warn(
                "Não foi possível obter fichas pelo AmestiaFicha:",
                erro
            );

        }

    }


    /*
     * Fallback direto ao Firestore.
     */

    const f =
        firebase();


    const usuario =
        usuarioAtual();


    const {

        collection,
        getDocs

    } =
        await import(FIREBASE_URL);


    const referencia =
        collection(
            f.db,
            "users",
            usuario.uid,
            "characters"
        );


    const resultado =
        await getDocs(
            referencia
        );


    const fichas = [];


    resultado.forEach(
        documento => {

            fichas.push({

                id:
                    documento.id,

                ...documento.data()

            });

        }
    );


    return fichas;

}



/* =========================================================
   RENDERIZAR SELETOR DE FICHA
========================================================= */

async function renderizarSeletorFicha(
    campanha
) {

    const container =
        $("campaignCharacterSelector");


    if (!container)
        return;


    const usuario =
        usuarioAtual();


    const personagens =
        campanha.personagens ||
        [];


    const personagemAtual =
        personagens.find(
            personagem =>
                personagem.jogadorId ===
                usuario.uid
        );


    let fichas = [];


    try {

        fichas =
            await obterMinhasFichas();

    }
    catch (erro) {

        container.innerHTML = `

            <div class="empty-state">

                <p>
                    Não foi possível carregar suas fichas.
                </p>

            </div>

        `;

        return;

    }


    if (!fichas.length) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    Você ainda não possui fichas.
                </h3>

                <p>
                    Crie uma ficha antes de vinculá-la à campanha.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <div class="section-heading">

            <span class="tag">
                PERSONAGEM
            </span>

            <h3>
                Escolha sua ficha
            </h3>

            <p>
                A ficha escolhida será associada a esta campanha.
            </p>

        </div>


        <div class="campaign-character-select">

            <select
                id="campaignCharacterSelect"
            >

                <option value="">
                    Selecione uma ficha
                </option>

                ${
                    fichas
                    .map(
                        ficha => `

                            <option
                                value="${escaparHTML(
                                    ficha.id
                                )}"
                                ${
                                    personagemAtual &&
                                    personagemAtual.fichaId ===
                                    ficha.id
                                        ? "selected"
                                        : ""
                                }
                            >

                                ${escaparHTML(
                                    ficha.nome ||
                                    "Personagem sem nome"
                                )}

                            </option>

                        `
                    )
                    .join("")
                }

            </select>


            <button
                type="button"
                class="btn primary"
                id="btnVincularFicha"
            >
                ${
                    personagemAtual
                        ? "Atualizar personagem"
                        : "Vincular ficha"
                }
            </button>

        </div>


        ${
            personagemAtual
                ? `

                    <div class="linked-character">

                        <span class="tag">
                            FICHA ATUAL
                        </span>

                        <strong>
                            ${escaparHTML(
                                personagemAtual.nome
                            )}
                        </strong>

                        <button
                            type="button"
                            class="small-btn danger"
                            id="btnDesvincularFicha"
                        >
                            Desvincular ficha
                        </button>

                    </div>

                `
                : ""
        }

    `;


    const botao =
        $("btnVincularFicha");


    if (botao) {

        botao.addEventListener(
            "click",
            async () => {

                const select =
                    $("campaignCharacterSelect");


                const fichaId =
                    select?.value;


                if (!fichaId) {

                    alert(
                        "Selecione uma ficha."
                    );

                    return;

                }


                const ficha =
                    fichas.find(
                        item =>
                            item.id ===
                            fichaId
                    );


                if (!ficha) {

                    alert(
                        "Ficha não encontrada."
                    );

                    return;

                }


                botao.disabled =
                    true;

                botao.textContent =
                    "Vinculando...";


                try {

                    await vincularFicha(

                        campanha.id,

                        ficha

                    );


                    alert(
                        "Ficha vinculada à campanha."
                    );


                    const atualizada =
                        await carregar(
                            campanha.id
                        );


                    window.AmestiaCampanhas.campanhaAtual =
                        atualizada;


                    renderizarPainel(
                        atualizada
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
                finally {

                    botao.disabled =
                        false;

                }

            }
        );

    }


    const desvincular =
        $("btnDesvincularFicha");


    if (desvincular) {

        desvincular.addEventListener(
            "click",
            async () => {

                if (
                    !confirm(
                        "Desvincular sua ficha desta campanha?"
                    )
                )
                    return;


                try {

                    await desvincularFicha(
                        campanha.id
                    );


                    alert(
                        "Ficha desvinculada."
                    );


                    const atualizada =
                        await carregar(
                            campanha.id
                        );


                    window.AmestiaCampanhas.campanhaAtual =
                        atualizada;


                    renderizarPainel(
                        atualizada
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
        );

    }

}



/* =========================================================
   PAINEL DA CAMPANHA
========================================================= */

async function renderizarPainel(
    campanha
) {

    const container =
        $("campaignPanel");


    if (!container)
        return;


    const usuario =
        usuarioAtual();


    const souMestre =
        campanha.mestreId ===
        usuario.uid;


    const personagens =
        campanha.personagens ||
        [];


    container.innerHTML = `

        <div class="campaign-panel-header">

            <div>

                <span class="tag">
                    ${
                        souMestre
                            ? "CAMPANHA · MESTRE"
                            : "CAMPANHA"
                    }
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


            <div>

                <strong>
                    CÓDIGO
                </strong>

                <div class="campaign-code">
                    ${escaparHTML(
                        campanha.codigo
                    )}
                </div>

            </div>

        </div>


        <!-- =================================================
             PERSONAGEM DO JOGADOR
        ================================================== -->

        ${
            !souMestre
                ? `

                    <section class="panel">

                        <div
                            id="campaignCharacterSelector"
                        >

                            <p>
                                Carregando suas fichas...
                            </p>

                        </div>

                    </section>

                `
                : ""
        }


        <!-- =================================================
             PARTICIPANTES
        ================================================== -->

        <section class="panel">

            <div class="section-heading">

                <span class="tag">
                    MESA
                </span>

                <h3>
                    Participantes
                </h3>

            </div>


            <div class="campaign-members">

                ${
                    (
                        campanha.membros ||
                        []
                    )
                    .map(
                        id => `

                            <div
                                class="campaign-member"
                            >

                                <span>
                                    ${
                                        id ===
                                        campanha.mestreId
                                            ? "Mestre"
                                            : "Jogador"
                                    }
                                </span>

                                <small>
                                    ${escaparHTML(
                                        id
                                    )}
                                </small>

                            </div>

                        `
                    )
                    .join("")
                }

            </div>

        </section>


        <!-- =================================================
             PERSONAGENS
        ================================================== -->

        <section class="panel">

            <div class="section-heading">

                <span class="tag">
                    PERSONAGENS
                </span>

                <h3>
                    Fichas da campanha
                </h3>

            </div>


            <div class="campaign-characters">

                ${
                    personagens.length
                        ? personagens
                            .map(
                                personagem => `

                                    <article
                                        class="campaign-character"
                                    >

                                        <span class="tag">
                                            PERSONAGEM
                                        </span>

                                        <h4>
                                            ${escaparHTML(
                                                personagem.nome
                                            )}
                                        </h4>

                                        <p>
                                            Jogador:
                                            ${escaparHTML(
                                                personagem.jogadorNome
                                            )}
                                        </p>

                                        <p>
                                            Linhagem:
                                            ${escaparHTML(
                                                personagem.linhagem ||
                                                "—"
                                            )}
                                        </p>

                                        ${
                                            souMestre
                                                ? `

                                                    <button
                                                        class="small-btn"
                                                        data-view-character="${escaparHTML(
                                                            personagem.fichaId
                                                        )}"
                                                    >
                                                        Visualizar ficha
                                                    </button>

                                                `
                                                : ""
                                        }

                                    </article>

                                `
                            )
                            .join("")
                        : `

                            <div class="empty-state">

                                <p>
                                    Nenhuma ficha foi vinculada à campanha.
                                </p>

                            </div>

                        `
                }

            </div>

        </section>


        <!-- =================================================
             FERRAMENTAS DO MESTRE
        ================================================== -->

        ${
            souMestre
                ? `

                    <section class="panel">

                        <div class="section-heading">

                            <span class="tag">
                                MESTRE
                            </span>

                            <button
    class="btn primary"
    id="btnAbrirPainelMestre"
>
    Abrir Painel do Mestre
</button>

                            <h3>
                                Ferramentas da campanha
                            </h3>

                        </div>


                        <div class="campaign-tools">

                            <button
                                class="btn ghost"
                                data-campaign-tool="sessions"
                            >
                                Sessões
                            </button>

                            <button
                                class="btn ghost"
                                data-campaign-tool="notes"
                            >
                                Anotações
                            </button>

                            <button
                                class="btn ghost"
                                data-campaign-tool="investigation"
                            >
                                Investigação
                            </button>

                            <button
                                class="btn ghost"
                                data-campaign-tool="combat"
                            >
                                Combate
                            </button>

                        </div>

                    </section>

                `
                : ""
        }

    `;


    /*
     * Depois que o HTML foi criado,
     * carregamos o seletor de fichas.
     */

    if (!souMestre) {

        await renderizarSeletorFicha(
            campanha
        );

    }

}



/* =========================================================
   ABRIR CAMPANHA
========================================================= */

async function abrir(
    campanhaId
) {

    try {

        const campanha =
            await carregar(
                campanhaId
            );


        if (!campanha) {

            alert(
                "Campanha não encontrada."
            );

            return;

        }


        window.AmestiaCampanhas.campanhaAtual =
            campanha;


        await renderizarPainel(
            campanha
        );


        if (
            typeof window.abrirAba ===
            "function"
        ) {

            window.abrirAba(
                "campanha"
            );

        }
        else if (
            typeof window.mostrarTela ===
            "function"
        ) {

            window.mostrarTela(
                "campanha"
            );

        }

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
   RENDERIZAR LISTA
========================================================= */

async function renderizar() {

    const container =
        $("campaignGrid");


    if (!container)
        return;


    container.innerHTML = `

        <div class="empty-state">

            <p>
                Carregando campanhas...
            </p>

        </div>

    `;


    try {

        const campanhas =
            await minhas();


        if (!campanhas.length) {

            container.innerHTML = `

                <div class="empty-state">

                    <h3>
                        Nenhuma campanha ainda.
                    </h3>

                    <p>
                        Crie uma campanha ou entre em uma usando um código.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            campanhas
            .map(
                campanha =>
                    `

                        <article
                            class="campaign-card"
                        >

                            <span class="tag">
                                ${
                                    campanha.mestreId ===
                                    usuarioAtual().uid
                                        ? "MESTRE"
                                        : "JOGADOR"
                                }
                            </span>

                            <h3>
                                ${escaparHTML(
                                    campanha.nome
                                )}
                            </h3>

                            <p>
                                ${escaparHTML(
                                    campanha.descricao ||
                                    "Sem descrição."
                                )}
                            </p>


                            <div class="campaign-meta">

                                <span>
                                    Código:
                                    <strong>
                                        ${escaparHTML(
                                            campanha.codigo
                                        )}
                                    </strong>
                                </span>

                                <span>
                                    ${
                                        (
                                            campanha.personagens ||
                                            []
                                        ).length
                                    }
                                    personagem(
                                    ${
                                        (
                                            campanha.personagens ||
                                            []
                                        ).length === 1
                                            ? ""
                                            : "s"
                                    })
                                </span>

                            </div>


                            <div class="card-actions">

                                <button
                                    class="small-btn"
                                    data-open-campaign="${campanha.id}"
                                >
                                    Abrir campanha
                                </button>


                                ${
                                    campanha.mestreId ===
                                    usuarioAtual().uid
                                        ? `

                                            <button
                                                class="small-btn danger"
                                                data-delete-campaign="${campanha.id}"
                                            >
                                                Excluir
                                            </button>

                                        `
                                        : `

                                            <button
                                                class="small-btn danger"
                                                data-leave-campaign="${campanha.id}"
                                            >
                                                Sair
                                            </button>

                                        `
                                }

                            </div>

                        </article>

                    `
            )
            .join("");

    }
    catch (erro) {

        console.error(
            erro
        );


        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    Erro ao carregar campanhas.
                </h3>

                <p>
                    ${escaparHTML(
                        erro.message
                    )}
                </p>

            </div>

        `;

    }

}



/* =========================================================
   EXCLUIR CAMPANHA
========================================================= */

async function excluir(
    campanhaId
) {

    const campanha =
        await carregar(
            campanhaId
        );


    if (!campanha) {

        throw new Error(
            "Campanha não encontrada."
        );

    }


    const usuario =
        usuarioAtual();


    if (
        campanha.mestreId !==
        usuario.uid
    ) {

        throw new Error(
            "Somente o mestre pode excluir a campanha."
        );

    }


    const f =
        firebase();


    const {

        doc,
        deleteDoc

    } =
        await import(FIREBASE_URL);


    await deleteDoc(

        doc(
            f.db,
            COLECAO,
            campanhaId
        )

    );


    return true;

}



/* =========================================================
   EVENTOS
========================================================= */

function configurarEventos() {

    document.addEventListener(
        "click",
        async evento => {

                      const painelMestreBotao =
                evento.target.closest(
                    "#btnAbrirPainelMestre"
                );


            if (painelMestreBotao) {

                const campanha =
                    window.AmestiaCampanhas.campanhaAtual;


                if (!campanha) {

                    alert(
                        "Nenhuma campanha foi selecionada."
                    );

                    return;

                }


                if (
                    campanha.mestreId !==
                    usuarioAtual().uid
                ) {

                    alert(
                        "Somente o mestre pode abrir este painel."
                    );

                    return;

                }


                if (
                    window.AmestiaMestrePainel &&
                    typeof
                    window.AmestiaMestrePainel.abrirPainel ===
                    "function"
                ) {

                    await
                    window.AmestiaMestrePainel.abrirPainel(
                        campanha.id
                    );

                }
                else {

                    alert(
                        "O Painel do Mestre ainda não foi carregado."
                    );

                }


                return;

            }

            const abrirBotao =
                evento.target.closest(
                    "[data-open-campaign]"
                );


            if (abrirBotao) {

                await abrir(
                    abrirBotao.dataset.openCampaign
                );

                return;

            }


            const sairBotao =
                evento.target.closest(
                    "[data-leave-campaign]"
                );


            if (sairBotao) {

                if (
                    !confirm(
                        "Deseja sair desta campanha?"
                    )
                )
                    return;


                try {

                    await sair(
                        sairBotao.dataset.leaveCampaign
                    );


                    alert(
                        "Você saiu da campanha."
                    );


                    await renderizar();

                }
                catch (erro) {

                    alert(
                        erro.message
                    );

                }


                return;

            }


            const excluirBotao =
                evento.target.closest(
                    "[data-delete-campaign]"
                );


            if (excluirBotao) {

                if (
                    !confirm(
                        "Excluir esta campanha permanentemente?"
                    )
                )
                    return;


                try {

                    await excluir(
                        excluirBotao.dataset.deleteCampaign
                    );


                    alert(
                        "Campanha excluída."
                    );


                    await renderizar();

                }
                catch (erro) {

                    alert(
                        erro.message
                    );

                }

            }

        }
    );

}



/* =========================================================
   FORMULÁRIO CRIAR
========================================================= */

function configurarFormularioCriar() {

    const formulario =
        $("campaignCreateForm");


    if (!formulario)
        return;


    formulario.addEventListener(
        "submit",
        async evento => {

            evento.preventDefault();


            const nome =
                $("campaignName")
                    ?.value
                    .trim();


            const descricao =
                $("campaignDescription")
                    ?.value
                    .trim();


            const botao =
                formulario.querySelector(
                    "button[type='submit']"
                );


            if (botao) {

                botao.disabled =
                    true;

                botao.textContent =
                    "Criando...";

            }


            try {

                const campanha =
                    await criar(
                        nome,
                        descricao
                    );


                formulario.reset();


                alert(
                    `Campanha criada!\n\nCódigo: ${campanha.codigo}`
                );


                await renderizar();


                await abrir(
                    campanha.id
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
            finally {

                if (botao) {

                    botao.disabled =
                        false;

                    botao.textContent =
                        "Criar campanha";

                }

            }

        }
    );

}



/* =========================================================
   FORMULÁRIO ENTRAR
========================================================= */

function configurarFormularioEntrar() {

    const formulario =
        $("campaignJoinForm");


    if (!formulario)
        return;


    formulario.addEventListener(
        "submit",
        async evento => {

            evento.preventDefault();


            const codigo =
                $("campaignCode")
                    ?.value
                    .trim();


            const botao =
                formulario.querySelector(
                    "button[type='submit']"
                );


            if (botao) {

                botao.disabled =
                    true;

                botao.textContent =
                    "Entrando...";

            }


            try {

                const campanha =
                    await entrar(
                        codigo
                    );


                formulario.reset();


                alert(
                    `Você entrou em "${campanha.nome}".`
                );


                await renderizar();


                await abrir(
                    campanha.id
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
            finally {

                if (botao) {

                    botao.disabled =
                        false;

                    botao.textContent =
                        "Entrar na campanha";

                }

            }

        }
    );

}



/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function iniciar() {

    configurarEventos();

    configurarFormularioCriar();

    configurarFormularioEntrar();


    /*
     * Atualiza campanhas quando o login estiver pronto.
     */

    if (
        window.AmestiaFirebase?.auth
    ) {

        window.AmestiaFirebase
            .auth
            .onAuthStateChanged(
                usuario => {

                    if (
                        usuario &&
                        $("campaignGrid")
                    ) {

                        renderizar();

                    }

                }
            );

    }

}



/* =========================================================
   API PÚBLICA
========================================================= */

window.AmestiaCampanhas = {

    criar,

    carregar,

    minhas,

    buscarPorCodigo,

    entrar,

    sair,

    atualizar,

    vincularFicha,

    desvincularFicha,

    obterMinhasFichas,

    renderizar,

    abrir,

    excluir,

    renderizarPainel,

    campanhaAtual:
        null

};



/* =========================================================
   DOM
========================================================= */

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