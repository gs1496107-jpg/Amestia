const AMESTIA = {

    atributos: {

        vigor: {
            nome: "Vigor",
            descricao:
                "Força física, resistência, capacidade corporal e tolerância a ferimentos."
        },

        agilidade: {
            nome: "Agilidade",
            descricao:
                "Velocidade, coordenação, reflexos e precisão corporal."
        },

        cognicao: {
            nome: "Cognição",
            descricao:
                "Raciocínio, memória, conhecimento e compreensão."
        },

        percepcao: {
            nome: "Percepção",
            descricao:
                "Atenção, sentidos, observação e leitura do ambiente."
        },

        presenca: {
            nome: "Presença",
            descricao:
                "Influência, expressão, comunicação e imposição."
        },

        vontade: {
            nome: "Vontade",
            descricao:
                "Autocontrole, resistência mental e determinação."
        }

    },


    pericias: [

        ["Atletismo", "vigor"],
        ["Luta Corporal", "vigor"],
        ["Fortitude", "vigor"],

        ["Acrobacia", "agilidade"],
        ["Pontaria", "agilidade"],
        ["Furtividade", "agilidade"],
        ["Ladragem", "agilidade"],

        ["Investigação", "cognicao"],
        ["Medicina", "cognicao"],
        ["Ciência/Ocultismo", "cognicao"],
        ["Ofício/Mecânica", "cognicao"],

        ["Prontidão", "percepcao"],
        ["Intuição", "percepcao"],
        ["Sobrevivência", "percepcao"],

        ["Enganação", "presenca"],
        ["Persuasão", "presenca"],
        ["Intimidação", "presenca"],
        ["Lábia/Manha", "presenca"],

        ["Autocontrole", "vontade"],
        ["Ancoragem", "vontade"]

    ],


    linhagens: [

        {
            id: "vampiro",
            nome: "Vampiro",
            tipo: "Graus da Sangria",
            descricao:
                "Indivíduos cuja existência foi alterada pela Sangria.",
            especializacoes:
                "Neófito, Hemomante e Ancião."
        },

        {
            id: "metamorfo",
            nome: "Metamorfo / Terianthropo",
            tipo: "Formas Bestiais",
            descricao:
                "Indivíduos capazes de assumir características animais.",
            especializacoes:
                "Lobo, Urso, Felino e Rato/Verme."
        },

        {
            id: "fantasma",
            nome: "Meio-Fantasma",
            tipo: "Estágios de Desapego",
            descricao:
                "Uma existência parcialmente afastada da matéria.",
            especializacoes:
                "Espectro Impermanente, Poltergeist e Manifestação de Éter."
        },

        {
            id: "anjo",
            nome: "Anjo",
            tipo: "Ordens de Alinhamento",
            descricao:
                "Uma linhagem relacionada às manifestações celestiais.",
            especializacoes:
                "Serafim, Querubim e Vigia."
        },

        {
            id: "demonio",
            nome: "Demônio",
            tipo: "Natureza do Pacto",
            descricao:
                "Uma existência marcada por pactos e consequências.",
            especializacoes:
                "Barganha e Ruína."
        },

        {
            id: "meio-monstro",
            nome: "Meio-Monstro",
            tipo: "Tipos de Mutação",
            descricao:
                "O corpo começou a manifestar diretamente o horror do outro lado do Véu.",
            especializacoes:
                "Carapaça Quitinosa, Anatomia Tentacular e Glândulas Anômalas."
        },

        {
            id: "mutante",
            nome: "Mutante",
            tipo: "Origem do Fator",
            descricao:
                "Pessoas alteradas por forças do próprio mundo.",
            especializacoes:
                "Químico/Radiação, Psíquico e Sensorial."
        },

        {
            id: "humano",
            nome: "Humano",
            tipo: "Aqueles que Resistiram",
            descricao:
                "Um investigador humano sem manifestação sobrenatural inata.",
            especializacoes:
                "Treinamento, experiência e escolhas."
        }

    ],


    dificuldades: [
        [5, "Muito fácil"],
        [10, "Fácil"],
        [15, "Média"],
        [20, "Difícil"],
        [25, "Extrema"],
        [30, "Sobrenatural"]
    ],


    graus: {

        I: {
            nome: "Princípios",
            custo: 10,
            custoPF: 2,
            requisito: 0
        },

        II: {
            nome: "Confluências",
            custo: 20,
            custoPF: 4,
            requisito: 2
        },

        III: {
            nome: "Epifanias",
            custo: 40,
            custoPF: 6,
            requisito: 2
        }

    },


    veu: {

        0: "Mundano — realidade normal.",

        1: "Estranheza — pequenas anomalias.",

        2: "Distorção — as leis da realidade começam a falhar.",

        3: "Colapso — o Akedonte invade diretamente o mundo.",

        4: "Fundo do Véu — lógica e linguagem começam a perder significado."

    },


    regras: [

        {
            id: "teste",
            nome: "Teste",
            texto: `
                <h3>Teste</h3>

                <p>
                    Quando existe risco, oposição ou possibilidade
                    real de fracasso:
                </p>

                <div class="rule-formula">
                    1d20 + Atributo + Perícia ≥ CD
                </div>

                <p>
                    Se o resultado for igual ou maior que a CD,
                    a ação é bem-sucedida.
                </p>
            `
        },


        {
            id: "vantagem",
            nome: "Vantagem e Desvantagem",
            texto: `
                <h3>Vantagem e Desvantagem</h3>

                <p>
                    Com Vantagem, role dois d20 e utilize o maior.
                </p>

                <p>
                    Com Desvantagem, role dois d20 e utilize o menor.
                </p>

                <p>
                    Elas não se acumulam.
                </p>
            `
        },


        {
            id: "investigacao",
            nome: "Investigação",
            texto: `
                <h3>Investigação</h3>

                <p>
                    Uma investigação deve possuir pistas capazes
                    de conduzir os jogadores à verdade.
                </p>

                <ul>
                    <li>Pista essencial</li>
                    <li>Rolagem</li>
                    <li>Consequência</li>
                    <li>Aprofundamento</li>
                </ul>

                <p>
                    Uma falha não deve simplesmente eliminar
                    uma pista necessária para continuar a história.
                </p>
            `
        },


        {
            id: "relogio",
            nome: "Relógio das Sombras",
            texto: `
                <h3>Relógio das Sombras</h3>

                <p>
                    O Relógio representa aquilo que acontece
                    enquanto os investigadores tentam descobrir
                    a verdade.
                </p>

                <ul>
                    <li>4 segmentos — perigo imediato</li>
                    <li>6 segmentos — perigo crescente</li>
                    <li>8 segmentos — perigo de longo prazo</li>
                </ul>
            `
        },


        {
            id: "veu",
            nome: "Densidade do Véu",
            texto: `
                <h3>Densidade do Véu</h3>

                <p>
                    A Densidade do Véu representa o quanto o
                    Absurdo está interferindo na realidade.
                </p>

                <p>
                    DV 0 → Mundano
                    <br>
                    DV 1 → Estranheza
                    <br>
                    DV 2 → Distorção
                    <br>
                    DV 3 → Colapso
                    <br>
                    DV 4 → Fundo do Véu
                </p>
            `
        },


        {
            id: "progressao",
            nome: "Progressão",
            texto: `
                <h3>Progressão dos Caminhos</h3>

                <p>
                    Grau I custa 10 PRO.
                </p>

                <p>
                    Grau II custa 20 PRO e exige duas habilidades
                    de Grau I daquele Caminho.
                </p>

                <p>
                    Grau III custa 40 PRO e exige duas habilidades
                    de Grau II.
                </p>

                <p>
                    Apenas dois Caminhos podem alcançar Grau III.
                </p>
            `
        }

    ]

};