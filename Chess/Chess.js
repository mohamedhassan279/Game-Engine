import { GameEngine } from '../GameEngine.js';

export class Chess extends GameEngine {

    constructor() {
        super();
    }

    init() {
        let state = [["1♜", "1♞", "1♝", "1♛", "1♚", "1♝", "1♞", "1♜"],
        ["1♟", "1♟", "1♟", "1♟", "1♟", "1♟", "1♟", "1♟"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["0♟", "0♟", "0♟", "0♟", "0♟", "0♟", "0♟", "0♟"],
        ["0♜", "0♞", "0♝", "0♛", "0♚", "0♝", "0♞", "0♜"]];
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
        player.innerText = state[1] ? "Player 2 turn" : "Player 1 turn";
        player.style.color = state[1] ? "#779556" : "#EBECD0";

        const board = document.createElement("div");
        board.className = "board";


        container.appendChild(player);
        container.appendChild(board);

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.id = String(8 - i).concat(String.fromCharCode('a'.charCodeAt(0) + j));
                cell.innerText = state[0][i][j] ? state[0][i][j][1] : "";
                if (state[0][i][j] != "" && state[0][i][j][0] == '0') {
                    cell.style.webkitTextFillColor = "#F9F9F9";
                    cell.style.webkitTextStrokeColor = "black";
                    cell.style.webkitTextStrokeWidth = "0.25px"
                }
                else if (state[0][i][j] != "" && state[0][i][j][0] == '1') {
                    cell.style.webkitTextFillColor = "#575452";
                    cell.style.webkitTextStrokeColor = "black";
                    cell.style.webkitTextStrokeWidth = "0.25px"
                }
                if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) cell.style.backgroundColor = "#EBECD0";
                else cell.style.backgroundColor = "#779556";
                board.appendChild(cell);
            }
        }
    }
    
    controller(state, input) {
        if (input === null || input === undefined || input.length != 5) {
            return [state, false];
        }
        try {
            let fromR = 8 - Number(input[0]);
            let fromC = input[1].charCodeAt(0) - 'a'.charCodeAt(0);
            let toR = 8 - Number(input[3]);
            let toC = input[4].charCodeAt(0) - 'a'.charCodeAt(0);
            if (fromR < 0 || fromR >= 8 || fromC < 0 || fromC >= 8
                || toR < 0 || toR >= 8 || toC < 0 || toC >= 8) {
                return [state, false];
            }
            if (state[0][fromR][fromC] == "" ||
                Number(state[0][fromR][fromC][0]) != state[1] ||
                Number(state[0][toR][toC][0]) == state[1]) {
                return [state, false];
            }
            else {
                if (!this.canMove(state, fromR, fromC, toR, toC))
                    return [state, false];
            }
        }
        catch (error) {
            return [state, false];
        }

    }
    canMove(state, fromR, fromC, toR, toC) {
        let piece = state[0][fromR][fromC][1];
        switch (piece) {
            case '♟': //pawn
                return this.pawnCanMove(state, fromR, fromC, toR, toC);
            case '♚':
                return this.kingCanMove(state, fromR, fromC, toR, toC);
            case '♛':
                return this.queenCanMove(state, fromR, fromC, toR, toC);
            case '♜':
                return this.rockCanMove(state, fromR, fromC, toR, toC);
        }
    }

    pawnCanMove(state, fromR, fromC, toR, toC) {
        let direction = turn ? 1 : -1;
        if (fromC === toC) {
            if (fromR + direction === toR && state[0][toR][toC] == '') { // one move
                return true
            }
            if (fromR + 2 * direction === toR && fromR === (turn ? 1 : 6) &&
                state[0][toR][toC] == '' && state[0][fromR + direction][toC] == "") { // double move
                return true
            }
        }
        if (fromR + direction === toR && Math.abs(fromC - toC) === 1) { // capture diagonally
            if (state[0][toR][toC] != "") {
                return true;
            }
        }
        return false;
    }

    kingCanMove(state, fromR, fromC, toR, toC) {
        // one move in any direction
        if (Math.abs(fromR - toR) <= 1 && Math.abs(fromC - toC) <= 1) {
            return true;
        }
        return false;
    }

    queenCanMove(state, fromR, fromC, toR, toC) {
        if (Math.abs(fromR - toR) === Math.abs(fromC - toC)) { // diagonal
            let rowDir = toR > fromR ? 1 : -1;
            let colDir = toC > toR ? 1 : -1;
            let i = fromR + rowDir;
            let j = fromC + colDir;
            while (i !== toR && j !== toC) {
                if (state[0][i][j] != "") {
                    return false; // Obstruction detected
                }
                i += rowDir;
                j += colDir;
            }
            return true;
        }
        if (fromR === toR) { // horizontal
            let colDir = toC > fromC ? 1 : -1;
            let j = fromC + colDir;
            while (j !== toC) {
                if (state[0][toR][j] != "") {
                    return false; // Obstruction detected
                }
                j += colDir;
            }
            return true;
        }
        if (fromC === toC) { //vertical
            let rowDir = toR > fromR ? 1 : -1;
            let i = fromR + rowDir;
            while (i !== toR) {
                if (state[0][toC][i] != "") {
                    return false; // Obstruction detected
                }
                i += rowDir;
            }
            return true;
        }
        return false;
    }


}