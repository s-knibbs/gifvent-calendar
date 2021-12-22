import { LitElement, html, css } from 'lit';
import { property, state, query } from 'lit/decorators.js';

import "@material/mwc-dialog";
import '@material/mwc-icon';


import type { Dialog } from "@material/mwc-dialog";


export class AppContainer extends LitElement {
    @property({ type: String }) title = 'GIFvent Calendar';
    @state() index: number = -1;
    @state() opened: Set<number> = new Set();

    static styles = css`

        mwc-textfield {
            display: block;
            margin-bottom: 5px;
        }

        :host {
            font-family: christmas;
            color: white;
        }

        .header {
            padding-left: 5%;
            padding-right: 5%;
        }

        .header > mwc-icon {
            float: right;
            margin-top: 20px;
            font-size: 150%;
            cursor: pointer;
        }

        h1 {
            margin-top: 10px;
            margin-bottom: 10px;
            float: left;
        }

        mwc-dialog {
            --mdc-dialog-max-width: 600px;
        }

        .content {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            grid-auto-rows: minmax(16vh, auto);
            padding-left: 5%;
            padding-right: 5%;
            width: 90%;
            height: calc(100vh - 80px);
            padding-top: 10px;
            padding-bottom: 10px;
        }

        .item {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #3e1313;
            border-radius: 5px;
            font-size: 200%;
            font-weight: bold;
        }

        .item img {
            overflow: hidden;
            max-width: 100%;
            height: 100%;
            cursor: pointer;
        }

        .past {
            background-color: #5ab500;
            cursor: pointer;
        }

        .present {
            background-color: #ff8f00;
            cursor: pointer;
        }

        .future {
            background-color: #291a4b;
        }
    `;

    @query("#gif-dialog")
    dialog?: Dialog;

    constructor() {
        super();
        const data = localStorage.getItem("OPENED");
        if (data) {
            this.opened = new Set(JSON.parse(data));
        }
    }

    reset() {
        this.opened = new Set();
        localStorage.removeItem("OPENED");
    }

    render() {
        const tiles = Array.from(Array(25).keys()).map((val) => {
            const today = new Date();
            let styleClass = "future";
            if (today.getMonth() === 11) {
                if (today.getDate() === (val + 1)) {
                    styleClass = "present";
                } else if (today.getDate() > val) {
                    styleClass = "past";
                }
            }
            const self = this;
            function onClick() {
                if (styleClass !== "future") {
                    self.index = val + 1;
                    self.opened.add(val);
                    self.dialog?.show();
                    localStorage.setItem("OPENED", JSON.stringify(Array.from(self.opened)));
                }
            }
            if (this.opened.has(val))
            {
                return html`
                    <div class="item" @click=${onClick}>
                        <img src="./assets/${val + 1}.gif" />
                    </div>
                `;
            } else {
                return html`
                    <div class="item ${styleClass}" @click=${onClick}>
                        ${val + 1}
                    </div>
                `;
            }
        })
        return html`
            <mwc-dialog id="gif-dialog" ?hideActions=${true}>
                <img src="./assets/${this.index}.gif" />
            </mwc-dialog>
            <div class="header">
                <h1>GIFvent Calendar</h1>
                <mwc-icon @click=${this.reset}>refresh</mwc-icon>
            </div>
            <div class="content">
                ${tiles}
            </div>
        `;
    }
}
