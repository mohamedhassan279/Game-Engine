import { GameEngine } from '../GameEngine.js';
export class EightQueens extends GameEngine {
    constructor() {
        super();
    }
    init() {
        let state = [];
        for (let i = 0; i < 8; i++) {
            state[i] = [];
            for (let j = 0; j < 8; j++) {
                state[i][j] = "";
            }
        }

        return [state, 0];
    }
    drawer(state) {
        const body = document.getElementsByTagName("body")[0];
        body.innerHTML = "";
        const container = document.createElement("div");
        container.className = "container";
        body.appendChild(container);

        const board = document.createElement("div");
        board.className = "board";

        container.appendChild(board);



        for (let i = 0; i < 8; i++) {
            var r = document.createElement("div");


            r.className = "r";

            r.innerText = (8 - i);
            r.style.fontSize = "150%";
            board.appendChild(r);
            for (let j = 0; j < 8; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.id = String(8 - i).concat(String.fromCharCode('a'.charCodeAt(0) + j));
                if (state[0][i][j] == '♛') { cell.innerText = '♛'; cell.style.fontSize = "150%"; }
                if (i == 0) cell.style.borderTop = "none";
                if (i == 7) cell.style.borderBottom = "none";
                if (j == 0) cell.style.borderLeft = "none";
                if (j == 7) cell.style.borderRight = "none";
                if ((i + j) % 2 === 0) {
                    cell.style.background = "#eedc82";
                }
                else {
                    cell.style.background = "#779556";
                }
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
            c.style.fontSize = "150%";
            c.style.font = "italic";
            board.appendChild(c);
        }

    }
    controller(state, input) {
        if (input === null || input === undefined || (input.length != 2 && input.length != 9)) {
            console.log(state);
            return [state, false];
        }
        try {
            let row = 8 - Number(input[input.length - 2]);
            let col = input[input.length - 1].charCodeAt(0) - 'a'.charCodeAt(0);
            if (row < 0 || row >= 8 || col < 0 || col >= 8) { return [state, false]; }
            if (input.length == 2) {
                if (state[0][row][col] === '') {
                    for (let i = 0; i < state[0].length; i++) {
                        let right = i + (col);
                        let left = (col) - i;
                        let above = (row) - i;
                        let below = i + (row);
                        if (right < state[0].length && col != right && state[0][row][right] === '♛') {
                            return [state, false];
                        }
                        if (left >= 0 && col != left && state[0][row][left] === '♛') {
                            return [state, false];
                        }
                        if (above >= 0 && row != above && state[0][above][col] === '♛') {
                            return [state, false];
                        }
                        if (below < state[0].length && row != below && state[0][below][col] === '♛') {//
                            return [state, false];
                        }
                        if (right < state[0].length && above >= 0 && row != above && col != right && state[0][above][right] === '♛') {
                            return [state, false];
                        }
                        if (left >= 0 && above >= 0 && row != above && col != left && state[0][above][left] === '♛') {
                            return [state, false];
                        }
                        if (below < state[0].length && left >= 0 && row != below && col != left && state[0][below][left] === '♛') {
                            return [state, false];
                        }
                        if (below < state[0].length && right < state[0].length && row != below && col != right && state[0][below][right] === '♛') {
                            return [state, false];
                        }
                    }
                    state[0][row][col] = '♛';

                    return [state, true];
                }
                else {

                    return [state, false];
                }
            }
            else if (input.length == 9) {
                if (state[0][row][col] != '') {
                    state[0][row][col] = '';

                    return [state, true];
                }
                else {

                    return [state, false];
                }
            }
        }
        catch (error) {
            return [state, false];
        }
    }
    isValid(grid, row, col) {
        if (grid[row][col] === '♛') {
            return false;
        }
        return true;
    }
    isValidundo(grid, row, col) {
        if (grid[row][col] === '') {
            return false;
        }
        return true;
    }
}
