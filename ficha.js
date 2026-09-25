/* =========================================================
   AMESTIA — SISTEMA DE FICHA
   FIREBASE / FIRESTORE
========================================================= */


/* =========================================================
   CONFIGURAÇÃO FIREBASE
========================================================= */

function obterFirebase() {

    if (!window.AmestiaFirebase) {

        console.error(
            "Firebase ainda não foi carregado."
        );

        return null;
    }

    return window.AmestiaFirebase;
}


/* =========================================================
   CRIAR FICHA
========================================================= */

function criarFicha() {

    const atributos = {};

    Object.keys(AMESTIA.atributos).forEach(
        id => {
            atributos[id] = 0;
        }
    );


    const pericias = {};

    AMESTIA.pericias.forEach(
        ([nome]) => {
            pericias[nome] = 0;
        }
    );


    return {

        id: null,

        donoId: null,

        nome: "",
        jogador: "",
        idade: "",
        historico: "",
        linhagem: "",
        guia: "cognicao",

        descricao: "",

        atributos,

        pericias,

        ancora1Nome: "",
        ancora1Desc: "",

        ancora2Nome: "",
        ancora2Desc: "",

        ancora3Nome: "",
        ancora3Desc: "",

        gatilho: "",
        efeito: "",
        tributo: "",

        equipamento: "",

        pvAtual: 0,
        estabilidadeAtual: 0,
        fluxoAtual: 0,

        protecao: 0,

        pro: 0,
        xp: 0,

        habilidades: [],

        caminhosGrauIII: [],

        veil: 0,

        criadoEm: null,
        atualizadoEm: null
    };
}


/* =========================================================
   CÁLCULOS DA FICHA
========================================================= */

function calcular(ficha) {

    const a =
        ficha.atributos || {};


    const vigor =
        Number(a.vigor || 0);


    const agilidade =
        Number(a.agilidade || 0);


    const cognicao =
        Number(a.cognicao || 0);


    const percepcao =
        Number(a.percepcao || 0);


    const presenca =
        Number(a.presenca || 0);


    const vontade =
        Number(a.vontade || 0);


    const pv =
        20 +
        vigor * 3;


    const estabilidade =
        20 +
        vontade * 2 +
        cognicao;


    const atributoGuia =
        ficha.guia === "presenca"
            ? presenca
            : cognicao;


    const fluxo =
        10 +
        atributoGuia * 2;


    const protecao =
        Number(
            ficha.protecao || 0
        );


    const prontidao =
        Number(
            ficha.pericias?.["Prontidão"] || 0
        ) * 2;


    const defesa =
        8 +
        agilidade +
        protecao;


    const iniciativa =
        percepcao +
        prontidao;


    const movimento =
        8 +
        agilidade;


    return {

        pv,

        estabilidade,

        fluxo,

        defesa,

        iniciativa,

        movimento
    };
}


/* =========================================================
   TOTAL DE ATRIBUTOS
========================================================= */

function totalAtributos(ficha) {

    return Object.values(
        ficha.atributos || {}
    )
    .reduce(
        (total, valor) =>
            total +
            Number(valor || 0),
        0
    );
}


/* =========================================================
   TOTAL DE PERÍCIAS
========================================================= */

function totalPericias(ficha) {

    return Object.values(
        ficha.pericias || {}
    )
    .reduce(
        (total, valor) =>
            total +
            Number(valor || 0),
        0
    );
}


/* =========================================================
   BÔNUS DE PERÍCIA
========================================================= */

function bonusPericia(valor) {

    valor =
        Number(
            valor || 0
        );


    if (valor <= 0)
        return 0;


    if (valor === 1)
        return 2;


    if (valor === 2)
        return 4;


    return 6;
}


/* =========================================================
   GRAU DO CAMINHO
========================================================= */

function grauCaminho(
    ficha,
    caminhoId
) {

    const habilidades =
        (ficha.habilidades || [])
        .filter(
            x =>
                Number(x.caminhoId) ===
                Number(caminhoId)
        );


    const grauIII =
        habilidades.filter(
            x => x.grau === "III"
        ).length;


    if (grauIII > 0)
        return "III";


    const grauII =
        habilidades.filter(
            x => x.grau === "II"
        ).length;


    if (grauII >= 2)
        return "II";


    const grauI =
        habilidades.filter(
            x => x.grau === "I"
        ).length;


    if (grauI > 0)
        return "I";


    return "—";
}


/* =========================================================
   VERIFICAR COMPRA DE HABILIDADE
========================================================= */

function podeComprar(
    ficha,
    caminho,
    grau
) {

    const habilidades =
        (ficha.habilidades || [])
        .filter(
            x =>
                Number(x.caminhoId) ===
                Number(caminho.id)
        );


    const jaPossui =
        habilidades.some(
            x => x.grau === grau
        );


    if (jaPossui) {

        return {

            permitido: false,

            motivo:
                "Você já possui essa habilidade."
        };
    }


    const custo =
        AMESTIA.graus[grau].custo;


    if (
        Number(ficha.pro || 0) < custo
    ) {

        return {

            permitido: false,

            motivo:
                `Você precisa de ${custo} PRO.`
        };
    }


    if (grau === "II") {

        const grauI =
            habilidades.filter(
                x => x.grau === "I"
            ).length;


        if (grauI < 2) {

            return {

                permitido: false,

                motivo:
                    "Você precisa de duas habilidades de Grau I neste Caminho."
            };
        }
    }


    if (grau === "III") {

        const grauII =
            habilidades.filter(
                x => x.grau === "II"
            ).length;


        if (grauII < 2) {

            return {

                permitido: false,

                motivo:
                    "Você precisa de duas habilidades de Grau II neste Caminho."
            };
        }


        const caminhosIII =
            ficha.caminhosGrauIII || [];


        const outroCaminho =
            caminhosIII.length > 0 &&
            !caminhosIII.includes(
                Number(caminho.id)
            );


        if (
            outroCaminho &&
            caminhosIII.length >= 2
        ) {

            return {

                permitido: false,

                motivo:
                    "Você já atingiu Grau III em dois Caminhos."
            };
        }
    }


    return {

        permitido: true,

        motivo: ""
    };
}


/* =========================================================
   COMPRAR HABILIDADE
========================================================= */

function comprar(
    ficha,
    caminho,
    habilidade,
    grau
) {

    const verificacao =
        podeComprar(
            ficha,
            caminho,
            grau
        );


    if (!verificacao.permitido)
        return verificacao;


    const custo =
        AMESTIA.graus[grau].custo;


    ficha.pro =
        Number(ficha.pro || 0) -
        custo;


    if (!Array.isArray(ficha.habilidades)) {

        ficha.habilidades = [];
    }


    ficha.habilidades.push({

        id:
            `${caminho.id}-${grau}-${habilidade.nome}`,

        caminhoId:
            Number(caminho.id),

        caminho:
            caminho.nome,

        grau,

        nome:
            habilidade.nome,

        texto:
            habilidade.texto
    });


    if (
        grau === "III" &&
        !ficha.caminhosGrauIII.includes(
            Number(caminho.id)
        )
    ) {

        ficha.caminhosGrauIII.push(
            Number(caminho.id)
        );
    }


    return {

        permitido: true,

        motivo:
            "Habilidade adquirida."
    };
}


/* =========================================================
   FIREBASE — OBTER USUÁRIO
========================================================= */

function obterUsuarioAtual() {

    const firebase =
        obterFirebase();


    if (
        !firebase ||
        !firebase.auth
    )
        return null;


    return firebase.auth.currentUser || null;
}


/* =========================================================
   FIREBASE — SALVAR FICHA
========================================================= */

async function salvarNoFirebase(
    ficha
) {

    const firebase =
        obterFirebase();


    if (!firebase) {

        throw new Error(
            "Firebase não está disponível."
        );
    }


    const usuario =
        obterUsuarioAtual();


    if (!usuario) {

        throw new Error(
            "Você precisa estar conectado para salvar uma ficha."
        );
    }


    const { db } = firebase;


    const {
        doc,
        setDoc,
        serverTimestamp
    } =
        await import(
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
        );


    if (!ficha.id) {

        ficha.id =
            doc(
                db,
                "users",
                usuario.uid,
                "characters"
            ).id;
    }


    ficha.donoId =
        usuario.uid;


    const dadosParaSalvar = {

        ...ficha,

        atualizadoEm:
            serverTimestamp()
    };


    if (!ficha.criadoEm) {

        dadosParaSalvar.criadoEm =
            serverTimestamp();
    }


    const referencia =
        doc(
            db,
            "users",
            usuario.uid,
            "characters",
            ficha.id
        );


    await setDoc(
        referencia,
        dadosParaSalvar,
        {
            merge: true
        }
    );


    console.log(
        "Ficha salva no Firestore:",
        ficha.id
    );


    return ficha;
}


/* =========================================================
   FIREBASE — CARREGAR FICHAS
========================================================= */

async function carregarDoFirebase() {

    const firebase =
        obterFirebase();


    if (!firebase) {

        throw new Error(
            "Firebase não está disponível."
        );
    }


    const usuario =
        obterUsuarioAtual();


    if (!usuario)
        return [];


    const { db } = firebase;


    const {
        collection,
        getDocs,
        orderBy,
        query
    } =
        await import(
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
        );


    const referencia =
        collection(
            db,
            "users",
            usuario.uid,
            "characters"
        );


    const consulta =
        query(
            referencia,
            orderBy(
                "atualizadoEm",
                "desc"
            )
        );


    const resultado =
        await getDocs(
            consulta
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


    console.log(
        "Fichas carregadas:",
        fichas.length
    );


    return fichas;
}


/* =========================================================
   FIREBASE — CARREGAR UMA FICHA
========================================================= */

async function carregarFichaFirebase(
    fichaId
) {

    const firebase =
        obterFirebase();


    if (!firebase) {

        throw new Error(
            "Firebase não está disponível."
        );
    }


    const usuario =
        obterUsuarioAtual();


    if (!usuario) {

        throw new Error(
            "Usuário não autenticado."
        );
    }


    const { db } = firebase;


    const {
        doc,
        getDoc
    } =
        await import(
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
        );


    const referencia =
        doc(
            db,
            "users",
            usuario.uid,
            "characters",
            fichaId
        );


    const resultado =
        await getDoc(
            referencia
        );


    if (!resultado.exists())
        return null;


    return {

        id:
            resultado.id,

        ...resultado.data()
    };
}


/* =========================================================
   FIREBASE — EXCLUIR FICHA
========================================================= */

async function excluirDoFirebase(
    fichaId
) {

    const firebase =
        obterFirebase();


    if (!firebase) {

        throw new Error(
            "Firebase não está disponível."
        );
    }


    const usuario =
        obterUsuarioAtual();


    if (!usuario) {

        throw new Error(
            "Usuário não autenticado."
        );
    }


    const { db } = firebase;


    const {
        doc,
        deleteDoc
    } =
        await import(
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
        );


    const referencia =
        doc(
            db,
            "users",
            usuario.uid,
            "characters",
            fichaId
        );


    await deleteDoc(
        referencia
    );


    console.log(
        "Ficha excluída:",
        fichaId
    );
}


/* =========================================================
   FIREBASE — ATUALIZAÇÃO AUTOMÁTICA
========================================================= */

async function atualizarNoFirebase(
    ficha
) {

    return salvarNoFirebase(
        ficha
    );
}


/* =========================================================
   API PÚBLICA DO AMESTIA
========================================================= */

window.AmestiaFicha = {

    criarFicha,

    calcular,

    totalAtributos,

    totalPericias,

    bonusPericia,

    grauCaminho,

    podeComprar,

    comprar,

    obterUsuarioAtual,

    salvarNoFirebase,

    carregarDoFirebase,

    carregarFichaFirebase,

    excluirDoFirebase,

    atualizarNoFirebase
};


console.log(
    "AmestiaFicha carregado."
);