import { GameEngine } from "../GameEngine.js";

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
        } else {
          state[i][j] = 0;
        }
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

    const player = document.createElement("h2");
    player.className = "player";
    player.innerText = !state[1] ? "Player 1 turn" : "Player 2 turn";
    player.style.color = !state[1] ? "red" : "white";

    const board = document.createElement("div");
    board.className = "board";

    container.appendChild(player);
    container.appendChild(board);
    let indexX_row_left = document.createElement("div");
    let indexX_row_right = document.createElement("div");
    indexX_row_left.className = "indexX-row-left";
    for (let i = 0; i < 8; i++) {
      let col = document.createElement("div");
      let index = document.createElement("p");
      index.innerText = String.fromCharCode("a".charCodeAt(0) + i);
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
        cell.id = String(8 - j).concat(
          String.fromCharCode("a".charCodeAt(0) + i)
        );
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
          index_below.innerText = String.fromCharCode("a".charCodeAt(0) + i);
          index_below.className = "index-below";
          col.appendChild(index_below);
        }
      }
      board.appendChild(col);
    }
    indexX_row_right.innerHTML = indexX_row_left.innerHTML;
    indexX_row_right.className = "indexX-row-right";
    board.appendChild(indexX_row_left);
    board.appendChild(indexX_row_right);
  }

  white_or_black(i, j) {
    if ((i % 2 == 0 && j % 2 == 0) || (j % 2 != 0 && i % 2 != 0))
      return "white";
    return "black";
  }

  controller(state, input) {
    let turn = !state[1] ? 1 : 2;
    if (input === null || input === undefined || input.length != 5) {
      return [state, false];
    }
    try {
      let fromR = 8 - Number(input[0]);
      let fromC = input[1].charCodeAt(0) - "a".charCodeAt(0);
      let toR = 8 - Number(input[3]);
      let toC = input[4].charCodeAt(0) - "a".charCodeAt(0);
      if (
        fromR < 0 ||
        fromR >= 8 ||
        fromC < 0 ||
        fromC >= 8 ||
        toR < 0 ||
        toR >= 8 ||
        toC < 0 ||
        toC >= 8
      ) {
        return [state, false];
      }

      if (
        (turn == 1 && state[0][fromR][fromC] != 1) ||
        (turn == 2 && state[0][fromR][fromC] != 2)
      ) {
        //to ensure that the right checker selected by the right player
        return [state, false];
      }

      let moveStatus = this.validate(turn, fromR, fromC, toR, toC, state[0]);

      if (moveStatus == "not valid") {
        return [state, false];
      } else if (moveStatus == "check for jmp") {
        let check = this.check_for_jmp(fromR, fromC, turn, state[0]);
        if (check == null) {
          return [state, false];
        }
        this.jmp_recursively(fromR, fromC, state[0], turn);
        return [state, true];
      } else {
        //just move
        //make the simple move then check for a jump
        state[0][fromR][fromC] = 0;
        state[0][toR][toC] = turn;
        return [state, true];
      }
    } catch {
      return [state, false];
    }
  }

  validate(player, oldi, oldj, newi, newj, board) {
    //checks that the move is valid
    if (player == 1) {
      if (newi - oldi == 1 && Math.abs(newj - oldj) == 1) {
        switch (board[newi][newj]) {
          case 0:
            return "just move";
          case 1:
            return "not valid";
          case 2:
            return "check for jmp";
        }
      } else {
        return "not valid";
      }
    } else {
      if (oldi - newi == 1 && Math.abs(newj - oldj) == 1) {
        switch (board[newi][newj]) {
          case 0:
            return "just move";
          case 2:
            return "not valid";
          case 1:
            return "check for jmp";
        }
      } else {
        return "not valid";
      }
    }
  }

  check_for_jmp(i, j, currentTurn, board) {
    if (currentTurn == 1) {
      let right_child = [i + 1, j + 1],
        left_child = [i + 1, j - 1];
      if (
        this.is_within(right_child) &&
        board[right_child[0]][right_child[1]] == 2
      ) {
        //you have a valid left child and it's occupied with a checker of the other player
        let right_of_right_child = [i + 2, j + 2];
        if (
          this.is_within(right_of_right_child) &&
          board[right_of_right_child[0]][right_of_right_child[1]] == 0
        ) {
          //if right right is empty then we need to move i,j to that empty spot (right right empty place)
          //and we'll need to remove the right child
          return "right jmp";
        }
      }
      if (
        this.is_within(left_child) &&
        board[left_child[0]][left_child[1]] == 2
      ) {
        //we do the same check for the left child
        let left_of_left_child = [i + 2, j - 2];
        if (
          this.is_within(left_of_left_child) &&
          board[left_of_left_child[0]][left_of_left_child[1]] == 0
        ) {
          return "left jmp";
        }
      }
      return null;
    } else {
      let right_child = [i - 1, j + 1],
        left_child = [i - 1, j - 1];
      if (
        this.is_within(right_child) &&
        board[right_child[0]][right_child[1]] == 1
      ) {
        //you have a valid left child and it's occupied with a checker of the other player
        let right_of_right_child = [i - 2, j + 2];
        if (
          this.is_within(right_of_right_child) &&
          board[right_of_right_child[0]][right_of_right_child[1]] == 0
        ) {
          //if right right is empty then we need to move i,j to that empty spot (right right empty place)
          //and we'll need to remove the right child
          return "right jmp";
        }
      }
      if (
        this.is_within(left_child) &&
        board[left_child[0]][left_child[1]] == 1
      ) {
        //we do the same check for the left child
        let left_of_left_child = [i - 2, j - 2];
        if (
          this.is_within(left_of_left_child) &&
          board[left_of_left_child[0]][left_of_left_child[1]] == 0
        ) {
          return "left jmp";
        }
      }
      return null;
    }
  }

  jmp_recursively(i, j, board, currentTurn) {
    if (!this.is_within([i, j])) return;
    if (currentTurn == 1) {
      let check = this.check_for_jmp(i, j, currentTurn, board);
      if (check == "right jmp") {
        board[i][j] = 0;
        board[i + 1][j + 1] = 0;
        board[i + 2][j + 2] = 1;
        this.jmp_recursively(i + 2, j + 2, board, currentTurn);
      } else if (check == "left jmp") {
        board[i][j] = 0;
        board[i + 1][j - 1] = 0;
        board[i + 2][j - 2] = 1;
        this.jmp_recursively(i + 2, j - 2, board, currentTurn);
      } else {
        return;
      }
    } else {
      let check = this.check_for_jmp(i, j, currentTurn, board);
      if (check == "right jmp") {
        board[i][j] = 0;
        board[i - 1][j + 1] = 0;
        board[i - 2][j + 2] = 2;
        this.jmp_recursively(i - 2, j + 2, board, currentTurn);
      } else if (check == "left jmp") {
        board[i][j] = 0;
        board[i - 1][j - 1] = 0;
        board[i - 2][j - 2] = 2;
        this.jmp_recursively(i - 2, j - 2, board, currentTurn);
      } else {
        return;
      }
    }
  }

  is_within(coord) {
    if (
      coord[0] >= this.ROWS ||
      coord[0] < 0 ||
      coord[1] >= this.COLS ||
      coord[1] < 0
    )
      return false;
    return true; //you have a child
  }
}
