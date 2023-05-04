import { GameEngine } from '../GameEngine.js';

export class Sudoku extends GameEngine {

    constructor() {
        super();
    }

    init() {
        let state = [["05", "03", "", "", "07", "", "", "", ""],
                     ["06", "", "", "01", "09", "05", "", "", ""],
                     ["", "09", "08", "", "", "", "", "06", ""],
                     ["08", "", "", "", "06", "", "", "", "03"],
                     ["04", "", "", "08", "", "03", "", "", "01"],
                     ["07", "", "", "", "02", "", "", "", "06"],
                     ["", "06", "", "", "", "", "02", "08", ""],
                     ["", "", "", "04", "01", "09", "", "", "05"],
                     ["", "", "", "", "08", "", "", "07", "09"]];
        
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

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.id = String(9 - i).concat(String.fromCharCode('a'.charCodeAt(0) + j));
                if(state[0][i][j] != "") cell.innerText = Number(state[0][i][j]);
                // cell.style.color = state[0][i][j] == "X" ? "#18FF21" : "#FF18B7";
                if(i%3 == 2) cell.style.borderBottomWidth = "2px";
                if(i%3 == 0) cell.style.borderTopWidth = "2px";
                if(j%3 == 2) cell.style.borderRightWidth = "2px";
                if(j%3 == 0) cell.style.borderLeftWidth = "2px";
                if(state[0][i][j][0] == '0') cell.style.backgroundColor = "rgb(158, 155, 155)";
                board.appendChild(cell);
            }
        }
    }
    controller(state, input) {
        if (input === null|| input === undefined || (input.length != 4 && input.length != 2)) {
            return [state, false];
        }
        try {
            let row = 9 - Number(input[0]);
            let col = input[1].charCodeAt(0) - 'a'.charCodeAt(0);
            let val;
            if(input.length == 2) val = "";
            else val = input[3];
            if (row < 0 || row >= 9 || col < 0 || col >= 9 || (val != '' && (val < '1' || val > '9') || 
                state[0][row][col][0] == '0')) {
                return [state, false];
            }
            if(input.length == 4) {
                let startR = Math.floor(row/3)*3;
                let startC = Math.floor(col/3)*3; 
                for(let i = startR; i < startR + 3; i++) {
                    for(let j = startC; j < startC + 3; j++) {
                        console.log(i, j);
                        if(Number(state[0][i][j]) == Number(val)) return [state, false];
                    }
                }
                for(let j = 0; j < 9; j++) {
                    if(Number(state[0][row][j]) == Number(val)) return [state, false];
                }
                for(let i = 0; i < 9; i++) {
                    if(Number(state[0][i][col]) == Number(val)) return [state, false];
                }

                state[0][row][col] = val;
                return [state, true];
            }
            else {
                if(state[0][row][col][0] == '0') return [state, false];
                state[0][row][col] = val;
                return [state, true];
            }
        }
        catch (error) {
            return [state, false];
        }
    }
}