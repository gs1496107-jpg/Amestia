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
// ESTADO
// ============================================================

let usuarioAtual = null;


// ============================================================
// ELEMENTO
// ============================================================

function elemento(id) {
    return document.getElementById(id);
}


// ============================================================
// LOGIN GOOGLE
// ============================================================

async function entrarComGoogle() {

    const botao = elemento("btnEntrarGoogle");

    try {

        if (botao) {
            botao.disabled = true;
            botao.textContent = "Conectando...";
        }

        console.log("Iniciando login com Google...");

        const resultado = await signInWithPopup(
            auth,
            googleProvider
        );

        const usuario = resultado.user;

        usuarioAtual = usuario;

        console.log(
            "Login realizado:",
            usuario.displayName
        );

        await salvarPerfil(usuario);

        atualizarInterface(usuario);

        return usuario;

    } catch (erro) {

        console.error(
            "Erro completo no login:",
            erro
        );

        tratarErroAuth(erro);

        return null;

    } finally {

        if (botao) {

            botao.disabled = false;

            if (!usuarioAtual) {
                botao.textContent = "Entrar com Google";
            }

        }

    }
}


// ============================================================
// SALVAR PERFIL
// ============================================================

async function salvarPerfil(usuario) {

    if (!usuario) {
        return;
    }

    try {

        const referencia = doc(
            db,
            "users",
            usuario.uid
        );

        await setDoc(
            referencia,
            {
                uid: usuario.uid,
                nome:
                    usuario.displayName ||
                    "Investigador",
                email:
                    usuario.email ||
                    "",
                foto:
                    usuario.photoURL ||
                    "",
                ultimoAcesso:
                    serverTimestamp()
            },
            {
                merge: true
            }
        );

        console.log(
            "Perfil salvo no Firestore."
        );

    } catch (erro) {

        console.error(
            "Erro ao salvar perfil:",
            erro
        );

        throw erro;
    }
}


// ============================================================
// SAIR
// ============================================================

async function sairDaConta() {

    try {

        await signOut(auth);

        usuarioAtual = null;

        atualizarInterface(null);

        console.log(
            "Usuário desconectado."
        );

    } catch (erro) {

        console.error(
            "Erro ao sair:",
            erro
        );

        alert(
            "Não foi possível sair da conta."
        );
    }
}


// ============================================================
// ESTADO DA AUTENTICAÇÃO
// ============================================================

onAuthStateChanged(
    auth,
    async (usuario) => {

        usuarioAtual =
            usuario || null;

        if (usuario) {

            console.log(
                "Usuário autenticado:",
                usuario.displayName
            );

            try {

                await salvarPerfil(usuario);

            } catch (erro) {

                console.error(
                    "Não foi possível atualizar o perfil:",
                    erro
                );

            }

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

    const nome =
        elemento("usuarioNome");

    const email =
        elemento("usuarioEmail");

    const foto =
        elemento("usuarioFoto");

    const botaoEntrar =
        elemento("btnEntrarGoogle");

    const botaoSair =
        elemento("btnSair");

    const status =
        elemento("statusLogin");


    // --------------------------------------------------------
    // LOGADO
    // --------------------------------------------------------

    if (usuario) {

        if (nome) {

            nome.textContent =
                usuario.displayName ||
                "Investigador";
        }

        if (email) {

            email.textContent =
                usuario.email ||
                "";
        }

        if (foto) {

            if (usuario.photoURL) {

                foto.src =
                    usuario.photoURL;

                foto.style.display =
                    "block";

            } else {

                foto.removeAttribute(
                    "src"
                );

                foto.style.display =
                    "none";
            }
        }

        if (botaoEntrar) {

            botaoEntrar.style.display =
                "none";
        }

        if (botaoSair) {

            botaoSair.style.display =
                "inline-flex";
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
    // DESLOGADO
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

        foto.removeAttribute(
            "src"
        );

        foto.style.display =
            "none";
    }

    if (botaoEntrar) {

        botaoEntrar.style.display =
            "inline-flex";

        botaoEntrar.disabled =
            false;

        botaoEntrar.textContent =
            "Entrar com Google";
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
// ERROS
// ============================================================

function tratarErroAuth(erro) {

    let mensagem =
        "Não foi possível entrar com o Google.";

    switch (erro.code) {

        case "auth/popup-blocked":

            mensagem =
                "O navegador bloqueou a janela de login. Permita pop-ups para este site.";

            break;


        case "auth/popup-closed-by-user":

            mensagem =
                "A janela de login foi fechada.";

            break;


        case "auth/cancelled-popup-request":

            mensagem =
                "O login foi cancelado.";

            break;


        case "auth/unauthorized-domain":

            mensagem =
                "Este endereço do site não está autorizado no Firebase Authentication.";

            break;


        case "auth/network-request-failed":

            mensagem =
                "Não foi possível conectar ao Firebase. Verifique sua internet.";

            break;


        case "auth/operation-not-allowed":

            mensagem =
                "O login com Google não está ativado no Firebase.";

            break;


        case "auth/internal-error":

            mensagem =
                "O Firebase encontrou um erro interno durante o login.";

            break;


        default:

            mensagem =
                erro.message ||
                mensagem;
    }

    console.warn(
        "Firebase Auth:",
        erro.code,
        erro.message
    );

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

            console.log(
                "Botão Google conectado."
            );

        } else {

            console.error(
                "ERRO: #btnEntrarGoogle não foi encontrado no HTML."
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
// API PÚBLICA
// ============================================================

window.AmestiaAuth = {

    entrar:
        entrarComGoogle,

    sair:
        sairDaConta,

    getUsuario:
        () => usuarioAtual,

    estaLogado:
        () => usuarioAtual !== null

};


console.log(
    "AmestiaAuth carregado."
);