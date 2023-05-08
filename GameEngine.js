export class GameEngine {
  constructor() {
    this.loop();
  }

  init() {}

  async loop() {
    let state = this.init();
    this.drawer(state);
    await new Promise((resolve) => setTimeout(resolve, 500));
    while (true) {
      let input = prompt("Enter your play: ");
      let response = this.controller(state, input);
      state = response[0];
      let valid = response[1];
      if (valid) {
        state = this.alternatePlayer(state);
        this.drawer(state);
      } else {
        alert("Invalid Move!! Try again...");
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  drawer(state) {}

  controller(state, input) {}

  alternatePlayer(state) {
    state[1] = !state[1];
    return state;
  }
}
