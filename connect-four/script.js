class connectFour{
    
    cells;
    currentTurn;
    ROWS;
    COLS;
    doc;
    cells;

    constructor() {
        this.ROWS = 6;
        this.COLS = 7;
        this.currentTurn = 1;
        this.cells = new Map();
        this.init();
        this.drawer();
    }

    init() {
        for (let i = 0; i < this.ROWS; i++) {
            for (let j = 0; j < this.COLS; j++) {
                let pos = "";
                pos += String(i) + String(j);
                this.cells.set(pos, "white");
            }
        }
        let p = document.createElement("h2");
        p.innerText = "Player 1's turn";
        p.id = "player";
        document.getElementsByTagName("body")[0].appendChild(p);
    }

    drawer() {
        let container = document.getElementById("container");
        let tmp = "";
        for (let i = 0; i < this.COLS; i++) {
            let tmpCol = "";
            let currColHTML = "";
            for (let j = 0; j < this.ROWS; j++) {
                let currID = "";
                currID = String(j) + String(i);
                currColHTML += `<div class="cell" id =${currID}></div>`;
            }
            tmpCol += `<div class="column" onclick = "colume_selected(${i})" id = "${i}">${currColHTML}</div>`;
            tmp += tmpCol;
        }
        container.innerHTML = tmp;
        for (let i = 0; i < this.ROWS; i++) {
            for (let j = 0; j < this.COLS; j++) {
                let currID = "";
                currID += String(i) + String(j);
                document.getElementById(`${currID}`).style.backgroundColor =
                    this.cells.get(currID);
            }
        }
    }

    controller(col) {
        let position = this.validate(col);
        if (position == null) {
            alert("Not a valid move!, please try again");
            return;
        }
        let currPlayer = this.getAndReverseTrun();
        let str = "";
        str += String(position.x) + String(position.y);
        if (currPlayer == 1) {
            this.cells.set(str, "red");
            this.drawer();
            let txt = document.getElementById("player");
            txt.innerText = "Player 2's turn";
            txt.style.color = "yellow";
        } else {
            this.cells.set(str, "yellow");
            this.drawer();
            let txt = document.getElementById("player");
            txt.innerText = "Player 1's turn";
            txt.style.color = "red";
        }
    }

    validate(col) {
        for (let i = this.ROWS - 1; i >= 0; i--) {
            if (this.cells.get(String(i) + String(col)) == "white") {
                let pos = {
                    x: i,
                    y: col
                };
                return pos;
            }
        }
        return null;
    }

    getAndReverseTrun() {
        let currPlayer = this.currentTurn;
        if (this.currentTurn == 1) this.currentTurn = 2;
        else this.currentTurn = 1;
        return currPlayer;
    }
}

let ob = new connectFour();

function colume_selected(col) {
    ob.controller(col);
}