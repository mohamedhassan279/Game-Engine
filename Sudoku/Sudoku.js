import { GameEngine } from '../GameEngine.js';

export class Sudoku extends GameEngine {

    constructor() {
        super();
    }

    init() {
        let state;
        state = Array.from({
            length: 9
        }, () => Array.from({
            length: 9
        }, () => ""));
        return [this.fillValues(state), 0];
    }

    fillValues(mat) {
        // Fill the diagona3 matrices
        this.fillDiagonal(mat);
 
        // Fill remaining blocks
        this.fillRemaining(0, 3, mat);
 
        // Remove Randomly K digits to make game
        this.removeKDigits(mat);
        return mat;
    }

    fillDiagonal(mat) {
        for (let i = 0; i < 9; i += 3) {
            // for diagonal box, start coordinates->i==j
            this.fillBox(i, i, mat);
        }
    }

    unUsedInBox(rowStart, colStart, num, mat) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (Number(mat[rowStart + i][colStart + j]) === num) {
                    return false;
                }
            }
        }
        return true;
    }

    fillBox(row, col, mat) {
        let num = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                while (true) {
                    num = this.randomGenerator(9);
                    if (this.unUsedInBox(row, col, num, mat)) {
                        break;
                    }
                }
                mat[row + i][col + j] = '0' + String(num);
            }
        }
    }

    randomGenerator(num) {
        return Math.floor(Math.random() * num + 1);
    }

    checkIfSafe(i, j, num, mat) {
        return (
            this.unUsedInRow(i, num, mat) &&
            this.unUsedInCol(j, num, mat) &&
            this.unUsedInBox(i - (i % 3), j - (j % 3), num, mat)
        );
    }

    unUsedInRow(i, num, mat) {
        for (let j = 0; j < 9; j++) {
            if (Number(mat[i][j]) === num) {
                return false;
            }
        }
        return true;
    }

    unUsedInCol(j, num, mat) {
        for (let i = 0; i < 9; i++) {
            if (Number(mat[i][j]) === num) {
                return false;
            }
        }
        return true;
    }

    fillRemaining(i, j, mat) {
        // Check if we have reached the end of the matrix
        if (i === 9 - 1 && j === 9) {
            return true;
        }
 
        // Move to the next row if we have reached the end of the current row
        if (j === 9) {
            i += 1;
            j = 0;
        }
 
 
        // Skip cells that are already filled
        if (mat[i][j] !== "") {
            return this.fillRemaining(i, j + 1, mat);
        }
 
        // Try filling the current cell with a valid value
        for (let num = 1; num <= 9; num++) {
            if (this.checkIfSafe(i, j, num, mat)) {
                mat[i][j] = '0' + String(num);
                if (this.fillRemaining(i, j + 1, mat)) {
                    return true;
                }
                mat[i][j] = "";
            }
        }
 
        // No valid value was found, so backtrack
        return false;
    }

    removeKDigits(mat) {
        let count = 40;
 
        while (count !== 0) {
            // extract coordinates i and j
            let i = Math.floor(Math.random() * 9);
            let j = Math.floor(Math.random() * 9);
            if (mat[i][j] !== "") {
                count--;
                mat[i][j] = "";
            }
        }
 
        return;
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