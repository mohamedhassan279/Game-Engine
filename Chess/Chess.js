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

            var r = document.createElement("div");
            r.className = "r";
            r.innerText = (8 - i);
            r.style.fontSize = "100%";
            board.appendChild(r);

            for (let j = 0; j < 8; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.id = String(8 - i).concat(String.fromCharCode('a'.charCodeAt(0) + j));
                cell.innerText = state[0][i][j] ? state[0][i][j][1] : "";
                if (state[0][i][j] != "" && state[0][i][j][0] == '0') {
                    cell.style.webkitTextFillColor = "#F9F9F9";
                    cell.style.webkitTextStrokeColor = "black";
                    cell.style.webkitTextStrokeWidth = "0.35px"
                }
                else if (state[0][i][j] != "" && state[0][i][j][0] == '1') {
                    cell.style.webkitTextFillColor = "#575452";
                    cell.style.webkitTextStrokeColor = "black";
                    cell.style.webkitTextStrokeWidth = "0.35px"
                }
                if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) cell.style.backgroundColor = "#EBECD0";
                else cell.style.backgroundColor = "#779556";
                if (i == 0) cell.style.borderTop = "4px ridge rgb(60, 61, 60)";
                if (i == 7) cell.style.borderBottom = "4px ridge rgb(60, 61, 60)";
                if (j == 0) cell.style.borderLeft = "4px ridge rgb(60, 61, 60)";
                if (j == 7) cell.style.borderRight = "4px ridge rgb(60, 61, 60)";
                board.appendChild(cell);
            }
        }
        for (let i = 0; i < 9; i++) {
            if (i == 0) {
                var c = document.createElement("div");
                c.className = "c";
                board.appendChild(c);
                continue;
            }
            var c = document.createElement("div");
            c.className = "c";
            c.innerText = String.fromCharCode('a'.charCodeAt(0) + i - 1);
            c.style.fontSize = "100%";
            c.style.font = "italic";
            board.appendChild(c);
        }
    }

    controller(state, input) {
        if (input === null || input === undefined || input.length != 5) {
            console.log("size");
            return [state, false];
        }
        try {
            let fromR = 8 - Number(input[0]);
            let fromC = input[1].charCodeAt(0) - 'a'.charCodeAt(0);
            let toR = 8 - Number(input[3]);
            let toC = input[4].charCodeAt(0) - 'a'.charCodeAt(0);
            console.log(fromR, fromC, toR, toC);
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
                if (!this.canMove(state, fromR, fromC, toR, toC)) {
                    return [state, false];
                }
                let tempState = this.simulate(state, fromR, fromC, toR, toC);
                console.log("state", state);
                console.log("temp", tempState);
                let kingR, kingC;
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        if (tempState[0][row][col] == "") {
                            continue;
                        }
                        if (Number(tempState[0][row][col][0]) != tempState[1] &&
                            tempState[0][row][col][1] === '♚') {
                            kingR = row;
                            kingC = col;
                        }
                    }
                }
                if (this.isKingInCheck(tempState, kingR, kingC)) {
                    return [state, false];
                }
                state[0][toR][toC] = state[0][fromR][fromC];
                state[0][fromR][fromC] = "";
                // state[1] = state[1] ? 0 : 1;
                return [state, true];
            }
        }
        catch (error) {
            console.log(error);
            return [state, false];
        }

    }

    canMove(state, fromR, fromC, toR, toC) {
        let piece = state[0][fromR][fromC][1];
        switch (piece) {
            case '♟': //pawn
                return this.pawnCanMove(state, fromR, fromC, toR, toC);
            case '♚': //king
                return this.kingCanMove(state, fromR, fromC, toR, toC);
            case '♛': //queen
                return this.queenCanMove(state, fromR, fromC, toR, toC);
            case '♜': //rock
                return this.rockCanMove(state, fromR, fromC, toR, toC);
            case '♝': //bishop
                return this.bishopCanMove(state, fromR, fromC, toR, toC);
            case '♞': //knight
                return this.knightCanMove(state, fromR, fromC, toR, toC);
        }
    }

    simulate(state, fromR, fromC, toR, toC) {
        let newState = [];
        for (let i = 0; i < 8; i++) {
            newState[i] = [];
            for (let j = 0; j < 8; j++) {
                newState[i][j] = state[0][i][j];
            }
        }
        newState[toR][toC] = newState[fromR][fromC];
        newState[fromR][fromC] = "";
        let turn = state[1] ? 0 : 1;
        return [newState, turn];
    }

    isKingInCheck(state, kingR, kingC) {
        console.log(kingR, kingC);
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (state[0][row][col] == "") {
                    continue;
                }
                if (state[1] == Number(state[0][row][col][0]) && this.canAttack(state, row, col, kingR, kingC)) {
                    return true;
                }
            }
        }
        return false;
    }

    canAttack(state, row, col, kingRow, kingCol) {
        let piece = state[0][row][col][1];
        console.log("r", row, col);
        console.log("kkk", state);
        switch (piece) {
            case '♟': //pawn
                let direction = state[1] ? 1 : -1;
                if (row + direction === kingRow && Math.abs(col - kingCol) === 1) { // capture diagonally
                    return true;
                }
            case '♚': //king
                return this.kingCanMove(state, row, col, kingRow, kingCol);
            case '♛': //queen
                return this.queenCanMove(state, row, col, kingRow, kingCol);
            case '♜': //rock
                return this.rockCanMove(state, row, col, kingRow, kingCol);
            case '♝': //bishop
                return this.bishopCanMove(state, row, col, kingRow, kingCol);
            case '♞': //knight
                return this.knightCanMove(state, row, col, kingRow, kingCol);
        }
    }

    pawnCanMove(state, fromR, fromC, toR, toC) {
        let direction = state[1] ? 1 : -1;
        if (fromC === toC) {
            if (fromR + direction === toR && state[0][toR][toC] == '') { // one move
                return true;
            }
            if (fromR + 2 * direction === toR && fromR === (state[1] ? 1 : 6) &&
                state[0][toR][toC] == '' && state[0][fromR + direction][toC] == "") { // double move
                return true;
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
            let colDir = toC > fromC ? 1 : -1;
            console.log("to from: ", fromR, fromC, toR, toC)
            let i = fromR + rowDir;
            let j = fromC + colDir;
            while (i !== toR && j !== toC) {
                console.log("i", i, "j", j);
                if (state[0][i][j] != "") {
                    console.log("state", state);
                    console.log("false")
                    return false; // Obstruction detected
                }
                i += rowDir;
                j += colDir;
            }
            console.log("true");
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
                if (state[0][i][toC] != "") {
                    return false; // Obstruction detected
                }
                i += rowDir;
            }
            return true;
        }
        return false;
    }

    rockCanMove(state, fromR, fromC, toR, toC) {
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
                if (state[0][i][toC] != "") {
                    return false; // Obstruction detected
                }
                i += rowDir;
            }
            return true;
        }
        return false;
    }

    bishopCanMove(state, fromR, fromC, toR, toC) {
        if (Math.abs(fromR - toR) === Math.abs(fromC - toC)) { // diagonal
            let rowDir = toR > fromR ? 1 : -1;
            let colDir = toC > fromC ? 1 : -1;
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
        return false;
    }

    knightCanMove(state, fromR, fromC, toR, toC) {
        if ((Math.abs(fromR - toR) === 2 && Math.abs(fromC - toC) === 1) ||
            (Math.abs(fromR - toR) === 1 && Math.abs(fromC - toC) === 2)) {
            return true;
        }
        return false;
    }
}