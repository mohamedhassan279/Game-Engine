import {
    GameEngine
} from "../GameEngine.js";

export class Checkers extends GameEngine {
    constructor() {
        super();
    }

    init() {
        let state = [];
        for (let i = 0; i < 8; i++) {
            state[i] = [];
            for (let j = 0; j < 8; j++) {
                if (i == 0 || i == 1 || i == 2) {
                    state[i][j] = this.white_or_black(i, j) == "black" ? 1 : 0;
                } else if (i == 5 || i == 6 || i == 7) {
                    state[i][j] = this.white_or_black(i, j) == "black" ? 2 : 0;
                }
            }
        }
        console.log(state);
        return [state, 1];
    }

    drawer(state) {
        console.log(state);
        const body = document.getElementsByTagName("body")[0];
        body.innerHTML = "";

        const container = document.createElement("div");
        container.className = "container";
        body.appendChild(container);

        const player = document.createElement("h2");
        player.className = "player";
        player.innerText = (state[1] == 1) ? "Player 1 turn" : "Player 2 turn";
        player.style.color = (state[1] == 1) ? "red" : "white";

        const board = document.createElement("div");
        board.className = "board";

        container.appendChild(player);
        container.appendChild(board);
        let indexX_row_left = document.createElement("div");
        let indexX_row_right = document.createElement("div");
        indexX_row_left.className = "indexX-row-left"
        for (let i = 0; i < 8; i++) {
            let col = document.createElement("div");
            let index = document.createElement("p");
            index.innerText = String.fromCharCode('a'.charCodeAt(0) + i);
            index.className = "index";
            col.className = "col";
            col.appendChild(index);

            let indexX = document.createElement("p");
            indexX.innerText = 8 - i;
            indexX.className = "indexX";
            indexX_row_left.appendChild(indexX);
            for (let j = 0; j < 8; j++) {
                let color = this.white_or_black(i, j);
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.id = String(8 - j).concat(String.fromCharCode('a'.charCodeAt(0) + i));
                cell.style.backgroundColor = color;
                let piece = document.createElement("div");
                piece.className = "piece";
                piece.id = `piece-${String(j) + String(i)}`;
                if (state[0][j][i] == 1) {
                    piece.style.backgroundColor = "red";
                    cell.appendChild(piece);
                } else if (state[0][j][i] == 2) {
                    piece.style.backgroundColor = "white";
                    cell.appendChild(piece);
                }
                col.appendChild(cell);
                if (j == 7) {
                    let index_below = document.createElement("p");
                    index_below.innerText = String.fromCharCode('a'.charCodeAt(0) + i);
                    index_below.className = "index-below";
                    col.appendChild(index_below);
                }
            }
            board.appendChild(col);
        }
        indexX_row_right.innerHTML = indexX_row_left.innerHTML;
        indexX_row_right.className = "indexX-row-right"
        board.appendChild(indexX_row_left)
        board.appendChild(indexX_row_right)
    }

    white_or_black(i, j) {
        if ((i % 2 == 0 && j % 2 == 0) || (j % 2 != 0 && i % 2 != 0)) return "white";
        return "black";
    }


}