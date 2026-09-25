// ============================================================
// AMESTIA — AUTENTICAÇÃO
// ============================================================

import {
    auth,
    googleProvider,
    db
} from "./firebase.js";

import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================================
// ESTADO DO USUÁRIO
// ============================================================

let usuarioAtual = null;


// ============================================================
// ELEMENTOS DA INTERFACE
// ============================================================

function elemento(id) {
    return document.getElementById(id);
}


// ============================================================
// LOGIN COM GOOGLE
// ============================================================

async function entrarComGoogle() {

    try {

        const resultado = await signInWithPopup(
            auth,
            googleProvider
        );

        const usuario = resultado.user;

        await salvarPerfil(usuario);

        console.log("Login realizado:", usuario.displayName);

        atualizarInterface(usuario);

        return usuario;

    } catch (erro) {

        console.error("Erro ao entrar com Google:", erro);

        tratarErroAuth(erro);

        return null;
    }
}


// ============================================================
// SALVAR PERFIL DO USUÁRIO
// ============================================================

async function salvarPerfil(usuario) {

    if (!usuario) return;

    const referencia = doc(
        db,
        "users",
        usuario.uid
    );

    await setDoc(
        referencia,
        {
            uid: usuario.uid,
            nome: usuario.displayName || "Investigador",
            email: usuario.email || "",
            foto: usuario.photoURL || "",
            ultimoAcesso: serverTimestamp()
        },
        {
            merge: true
        }
    );

    console.log("Perfil salvo no Firestore.");
}


// ============================================================
// LOGOUT
// ============================================================

async function sairDaConta() {

    try {

        await signOut(auth);

        console.log("Usuário desconectado.");

        atualizarInterface(null);

    } catch (erro) {

        console.error(
            "Erro ao sair da conta:",
            erro
        );
    }
}


// ============================================================
// OBSERVAR ESTADO DE LOGIN
// ============================================================

onAuthStateChanged(
    auth,
    async (usuario) => {

        usuarioAtual = usuario || null;

        if (usuario) {

            console.log(
                "Usuário autenticado:",
                usuario.displayName
            );

            await salvarPerfil(usuario);

            atualizarInterface(usuario);

        } else {

            console.log(
                "Nenhum usuário autenticado."
            );

            atualizarInterface(null);
        }
    }
);


// ============================================================
// ATUALIZAR INTERFACE
// ============================================================

function atualizarInterface(usuario) {

    const nome = elemento("usuarioNome");
    const email = elemento("usuarioEmail");
    const foto = elemento("usuarioFoto");

    const botaoEntrar = elemento("btnEntrarGoogle");
    const botaoSair = elemento("btnSair");

    const status = elemento("statusLogin");


    // --------------------------------------------------------
    // USUÁRIO LOGADO
    // --------------------------------------------------------

    if (usuario) {

        if (nome) {
            nome.textContent =
                usuario.displayName ||
                "Investigador";
        }

        if (email) {
            email.textContent =
                usuario.email || "";
        }

        if (foto) {

            if (usuario.photoURL) {
                foto.src = usuario.photoURL;
            }

            foto.style.display = "block";
        }

        if (botaoEntrar) {
            botaoEntrar.style.display = "none";
        }

        if (botaoSair) {
            botaoSair.style.display = "inline-flex";
        }

        if (status) {

            status.textContent =
                "Conectado";

            status.dataset.status =
                "online";
        }

        return;
    }


    // --------------------------------------------------------
    // USUÁRIO NÃO LOGADO
    // --------------------------------------------------------

    if (nome) {
        nome.textContent =
            "Visitante";
    }

    if (email) {
        email.textContent =
            "Entre para continuar";
    }

    if (foto) {
        foto.removeAttribute("src");
    }

    if (botaoEntrar) {
        botaoEntrar.style.display =
            "inline-flex";
    }

    if (botaoSair) {
        botaoSair.style.display =
            "none";
    }

    if (status) {

        status.textContent =
            "Desconectado";

        status.dataset.status =
            "offline";
    }
}


// ============================================================
// TRATAMENTO DE ERROS
// ============================================================

function tratarErroAuth(erro) {

    let mensagem =
        "Não foi possível entrar.";

    switch (erro.code) {

        case "auth/popup-closed-by-user":

            mensagem =
                "A janela de login foi fechada.";

            break;


        case "auth/popup-blocked":

            mensagem =
                "O navegador bloqueou a janela de login.";

            break;


        case "auth/cancelled-popup-request":

            mensagem =
                "O login foi cancelado.";

            break;


        case "auth/network-request-failed":

            mensagem =
                "Verifique sua conexão com a internet.";

            break;


        case "auth/unauthorized-domain":

            mensagem =
                "Este domínio ainda não está autorizado no Firebase.";

            break;
    }

    console.warn(mensagem);

    alert(mensagem);
}


// ============================================================
// EVENTOS
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const botaoEntrar =
            elemento("btnEntrarGoogle");

        const botaoSair =
            elemento("btnSair");


        if (botaoEntrar) {

            botaoEntrar.addEventListener(
                "click",
                entrarComGoogle
            );
        }


        if (botaoSair) {

            botaoSair.addEventListener(
                "click",
                sairDaConta
            );
        }
    }
);


// ============================================================
// FUNÇÕES PÚBLICAS
// ============================================================

window.AmestiaAuth = {

    entrar: entrarComGoogle,

    sair: sairDaConta,

    getUsuario: () => usuarioAtual,

    estaLogado: () => {
        return usuarioAtual !== null;
    }

};