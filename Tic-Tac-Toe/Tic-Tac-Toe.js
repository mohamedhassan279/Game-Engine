import { GameEngine } from '../GameEngine.js';

export class TicTacToe extends GameEngine {

    constructor() {
        super();
    }

    init() {
        let state = [];
        for (let i = 0; i < 3; i++) {
            state[i] = [];
            for (let j = 0; j < 3; j++) {
                state[i][j] = "";
            }
        }
        console.log([state, 0]);
        return [state, 0];
    }

    drawer(state) {
        const body = document.getElementsByTagName("body")[0];
        body.innerHTML = "";

        const container = document.createElement("div");
        container.className = "container";
        body.appendChild(container);

        const player = document.createElement("h2");
        player.className = "player";
        player.innerText = state[1] ? "Player 2 turn O" : "Player 1 turn X";
        player.style.color = state[1] ? "#FF18B7" : "#18FF21";

        const board = document.createElement("div");
        board.className = "board";


        container.appendChild(player);
        container.appendChild(board);

        for (let i = 0; i < 3; i++) {

            var r=document.createElement("div");
            r.className="r";
            r.innerText=(3-i);
            r.style.fontSize="100%";
            r.style.color = "yellow";
            board.appendChild(r);

            for (let j = 0; j < 3; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.id = String(3 - i).concat(String.fromCharCode('a'.charCodeAt(0) + j));
                cell.innerText = state[0][i][j];
                cell.style.color = state[0][i][j] == "X" ? "#18FF21" : "#FF18B7";
                if (i == 0) cell.style.borderTop = "none";
                if (i == 2) cell.style.borderBottom = "none";
                if (j == 0) cell.style.borderLeft = "none";
                if (j == 2) cell.style.borderRight = "none";
                board.appendChild(cell);
            }
        }
        for(let i=0; i<4;i++)
        {
            if(i==0)
            {
                var c=document.createElement("div");
                c.className="c";
                
                board.appendChild(c);
                continue;
            }
            var c=document.createElement("div");
            c.className="c";
            c.innerText=String.fromCharCode('a'.charCodeAt(0)+i-1);
            c.style.fontSize="100%";
            c.style.font="italic";
            c.style.color = "yellow";
            board.appendChild(c);
        }
    }
    controller(state, input) {
        if (input === null || input === undefined || input.length != 2) {
            return [state, false];
        }
        try {
            let row = 3 - Number(input[0]);
            let col = input[1].charCodeAt(0) - 'a'.charCodeAt(0);
            if (row < 0 || row >= 3 || col < 0 || col >= 3) {
                return [state, false];
            }
            if (state[0][row][col] == "") {
                state[0][row][col] = state[1] ? 'O' : 'X';
                return [state, true];
            }
            else {
                return [state, false];
            }
        }
        catch (error) {
            return [state, false];
        }
    }
}