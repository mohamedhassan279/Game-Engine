export class GameEngine {

    constructor() {
        this.loop();
    }

    init() {

    }

    async loop() {
        let state = this.init();
        this.drawer(state);
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            let input = prompt("Enter your play: ");
            let response = this.controller(state, input);
            state = response[0];
            let valid = response[1];
            if (valid) {
                this.drawer(state);
            }
            else {
                alert("Invalid Move!! Try again...");
            }
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    drawer(state) {

    }

    controller(state, input) {

    }

    alternatePlayer(turn) {
        return !turn;
    }
}