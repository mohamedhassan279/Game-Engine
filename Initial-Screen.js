const prompt=require("prompt-sync")();
class Init_Screen {
    Init() {
        console.log(`Please, Enter the option you want:
1) choose 1 to start Tic-Tac-Toe game.
2) choose 2 to start Connect4 game.
3) choose 3 to start Checkers game.
4) choose 4 to start Chess game.
5) choose 5 to start Sudoku game.
6) choose 6 to start 8-Queens game.
7) Exit`);
        var choice = parseInt(prompt());
        var game;
        switch (choice) {
            case 1: { game = new Tic_Tac_Toe(); break; }
            case 2: { game = new Connect4(); break; }
            case 3: { game = new Checker(); break; }
            case 4: { game = new Chess(); break; }
            case 5: { game = new Sudoku(); break; }
            case 6: { game = new Eight_Queens(); break; }
            case 7: { return 0; }
            default:
                {
                    console.log('Invalid choice! Please Enter a number from 1 to 7.');
                    this.Init();
                }
        }
    }
}

var start=new Init_Screen();
start.Init();
console.log("hello");