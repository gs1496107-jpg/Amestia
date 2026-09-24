/* =========================================================
   AMESTIA — SISTEMA DE FICHA
========================================================= */

window.AmestiaFicha = {

    criarFicha() {

        const atributos = {};

        Object.keys(AMESTIA.atributos).forEach(id => {
            atributos[id] = 0;
        });


        const pericias = {};

        AMESTIA.pericias.forEach(([nome]) => {
            pericias[nome] = 0;
        });


        return {

            id: null,

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

            pro: 0,
            xp: 0,

            habilidades: [],

            caminhosGrauIII: [],

            veil: 0

        };

    },


    calcular(ficha) {

        const a = ficha.atributos;


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
            20 + vigor * 3;


        const estabilidade =
            20 +
            vontade * 2 +
            cognicao;


        const atributoGuia =
            ficha.guia === "presenca"
                ? presenca
                : cognicao;


        const fluxo =
            10 + atributoGuia * 2;


        const protecao =
            Number(ficha.protecao || 0);


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
            8 + agilidade;


        return {

            pv,
            estabilidade,
            fluxo,

            defesa,

            iniciativa,

            movimento

        };

    },


    totalAtributos(ficha) {

        return Object.values(
            ficha.atributos
        )
        .reduce(
            (a, b) => a + Number(b || 0),
            0
        );

    },


    totalPericias(ficha) {

        return Object.values(
            ficha.pericias
        )
        .reduce(
            (a, b) => a + Number(b || 0),
            0
        );

    },


    bonusPericia(valor) {

        valor = Number(valor || 0);

        if (valor <= 0)
            return 0;

        if (valor === 1)
            return 2;

        if (valor === 2)
            return 4;

        return 6;

    },


    grauCaminho(ficha, caminhoId) {

        const habilidades =
            ficha.habilidades
            .filter(
                x => Number(x.caminhoId) === Number(caminhoId)
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

    },


    podeComprar(ficha, caminho, grau) {

        const habilidades =
            ficha.habilidades
            .filter(
                x =>
                    Number(x.caminhoId)
                    === Number(caminho.id)
            );


        const jaPossui =
            habilidades.some(
                x => x.grau === grau
            );


        if (jaPossui)
            return {
                permitido: false,
                motivo: "Você já possui essa habilidade."
            };


        const custo =
            AMESTIA.graus[grau].custo;


        if (
            Number(ficha.pro || 0)
            < custo
        ) {

            return {
                permitido: false,
                motivo: `Você precisa de ${custo} PRO.`
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

    },


    comprar(ficha, caminho, habilidade, grau) {

        const verificacao =
            this.podeComprar(
                ficha,
                caminho,
                grau
            );


        if (!verificacao.permitido)
            return verificacao;


        const custo =
            AMESTIA.graus[grau].custo;


        ficha.pro =
            Number(ficha.pro || 0)
            - custo;


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
            motivo: "Habilidade adquirida."
        };

    }

};