import Gemini from "./gemini.js";

class Main extends Gemini {
  constructor() {
    super();
  }
}

export default Main;

const main = new Main(); // instance of Main
console.log(await main.getResponse("Olá", "gemini-2.5-pro")); // check if the secret is set
