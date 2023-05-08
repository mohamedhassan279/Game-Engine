import { GameEngine } from '../GameEngine.js';

export class Connect_Four extends GameEngine{
    constructor() {
        super();
    }

    init() {
        let state = [];
        for (let i = 0; i < 6; i++) {
            state[i] = [];
            for (let j = 0; j < 7; j++) {
                state[i][j] = "white";
            }
        }
        console.log([state, 0]);
        return [state, 0];
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
        player.innerText = state[1] ? "Player 2 turn" : "Player 1 turn";
        player.style.color = state[1] ? "yellow" : "red";

        const board = document.createElement("div");
        board.className = "board";

        container.appendChild(player);
        container.appendChild(board);

        for(let i = 0 ; i<7 ; i++){
            let col = document.createElement("div");
            let index = document.createElement("p");
            index.innerText = i;
            index.className = "index";
            col.className = "column";
            col.id = `${i}`;
            col.appendChild(index);
            for(let j = 0 ; j<6 ; j++){
                let currID = "";
                currID = String(j) + String(i);
                let cell = document.createElement("div");
                cell.className = "cell";
                cell.id  = currID;
                cell.style.backgroundColor = state[0][j][i];
                col.appendChild(cell);
            }
            board.appendChild(col);
        }
    }


    controller(state, input) {
        if (input === null || input === undefined || input.length != 1) {
            return [state, false];
        }

        for (let i = 5 ; i >= 0; i--) {
            if (state[0][i][input] == "white") {
                state[0][i][input] = state[1] ? "yellow" : "red";
                return [state, true];
            }
        }
        return [state, false];
    }
}