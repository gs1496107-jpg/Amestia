/* =========================================================
   AMESTIA — FERRAMENTAS DO MESTRE
========================================================= */

window.AmestiaMestre = {

    clocks: [],

    veil: 0,


    iniciar() {

        this.carregar();

        this.renderizarRelogios();

        this.renderizarVeu();

        this.configurarEventos();

    },


    salvar() {

        localStorage.setItem(
            "amestia_mestre",
            JSON.stringify({

                clocks: this.clocks,

                veil: this.veil

            })
        );

    },


    carregar() {

        try {

            const dados =
                JSON.parse(
                    localStorage.getItem(
                        "amestia_mestre"
                    )
                );


            if (!dados)
                return;


            this.clocks =
                dados.clocks || [];


            this.veil =
                Number(dados.veil || 0);

        }
        catch {

            this.clocks = [];

            this.veil = 0;

        }

    },


    criarRelogio(nome, tamanho) {

        const relogio = {

            id:
                Date.now(),

            nome:
                nome || "Novo relógio",

            tamanho:
                Number(tamanho),

            preenchido:
                0

        };


        this.clocks.push(
            relogio
        );


        this.salvar();

        this.renderizarRelogios();

    },


    avancar(id, valor) {

        const relogio =
            this.clocks.find(
                x => x.id === Number(id)
            );


        if (!relogio)
            return;


        relogio.preenchido =
            Math.max(
                0,
                Math.min(
                    relogio.tamanho,
                    relogio.preenchido + valor
                )
            );


        this.salvar();

        this.renderizarRelogios();

    },


    remover(id) {

        this.clocks =
            this.clocks.filter(
                x => x.id !== Number(id)
            );


        this.salvar();

        this.renderizarRelogios();

    },


    renderizarRelogios() {

        const container =
            document.getElementById(
                "clockGrid"
            );


        if (!container)
            return;


        if (
            this.clocks.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-state">
                    Nenhum Relógio criado.
                </div>
            `;

            return;

        }


        container.innerHTML =
            this.clocks
            .map(clock => {

                const segmentos =
                    Array.from(
                        {
                            length:
                                clock.tamanho
                        },
                        (_, i) => {

                            const ativo =
                                i <
                                clock.preenchido;

                            return `
                                <button
                                    class="clock-segment ${ativo ? "filled" : ""}"
                                    data-clock="${clock.id}"
                                    data-index="${i}"
                                    title="Segmento ${i + 1}"
                                ></button>
                            `;

                        }
                    )
                    .join("");


                return `

                    <article class="clock-card">

                        <div class="clock-header">

                            <div>

                                <span class="tag">
                                    RELÓGIO
                                </span>

                                <h3>
                                    ${this.escape(clock.nome)}
                                </h3>

                            </div>


                            <button
                                class="small-btn danger"
                                data-remove-clock="${clock.id}"
                            >
                                ×
                            </button>

                        </div>


                        <div class="clock-segments">

                            ${segmentos}

                        </div>


                        <div class="clock-footer">

                            <span>
                                ${clock.preenchido}/${clock.tamanho}
                            </span>


                            <div>

                                <button
                                    class="small-btn"
                                    data-clock-action="${clock.id}"
                                    data-change="-1"
                                >
                                    −
                                </button>

                                <button
                                    class="small-btn"
                                    data-clock-action="${clock.id}"
                                    data-change="1"
                                >
                                    +
                                </button>

                            </div>

                        </div>

                    </article>

                `;

            })
            .join("");

    },


    renderizarVeu() {

        const nivel =
            document.getElementById(
                "veilLevel"
            );


        const descricao =
            document.getElementById(
                "veilDescription"
            );


        if (!nivel)
            return;


        nivel.textContent =
            `DV ${this.veil}`;


        descricao.textContent =
            AMESTIA.veu[this.veil];

    },


    alterarVeu(valor) {

        this.veil =
            Math.max(
                0,
                Math.min(
                    4,
                    this.veil + valor
                )
            );


        this.salvar();

        this.renderizarVeu();

    },


    configurarEventos() {

        document.addEventListener(
            "click",
            evento => {

                const criar =
                    evento.target.closest(
                        "#createClock"
                    );


                if (criar) {

                    const nome =
                        document.getElementById(
                            "clockName"
                        ).value;


                    const tamanho =
                        document.getElementById(
                            "clockSize"
                        ).value;


                    this.criarRelogio(
                        nome,
                        tamanho
                    );


                    document.getElementById(
                        "clockName"
                    ).value = "";

                }


                const segmento =
                    evento.target.closest(
                        ".clock-segment"
                    );


                if (segmento) {

                    const id =
                        segmento.dataset.clock;


                    const index =
                        Number(
                            segmento.dataset.index
                        );


                    const clock =
                        this.clocks.find(
                            x =>
                                x.id ===
                                Number(id)
                        );


                    if (clock) {

                        clock.preenchido =
                            index + 1;

                        this.salvar();

                        this.renderizarRelogios();

                    }

                }


                const acao =
                    evento.target.closest(
                        "[data-clock-action]"
                    );


                if (acao) {

                    this.avancar(

                        acao.dataset.clockAction,

                        Number(
                            acao.dataset.change
                        )

                    );

                }


                const remover =
                    evento.target.closest(
                        "[data-remove-clock]"
                    );


                if (remover) {

                    this.remover(
                        remover.dataset.removeClock
                    );

                }


                const veil =
                    evento.target.closest(
                        "[data-veil]"
                    );


                if (veil) {

                    this.alterarVeu(
                        Number(
                            veil.dataset.veil
                        )
                    );

                }

            }
        );

    },


    escape(texto) {

        return String(texto || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }

};