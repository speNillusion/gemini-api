import Gemini from "./gemini.js";

class Main extends Gemini {
  constructor() {
    super();
  }
}

export default Main;

const main = new Main(); // instance of Main
await main.getResponse("Qual é melhor, ts ou js", "gemini-2.5-flash") // check if the secret is set
