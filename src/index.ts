import Gemini from "./gemini.js";

class Main extends Gemini {
  constructor() {
    super();
  }
}

export default Main;

const main = new Main(); // instance of Main
await main.getResponseText("Faça um codigo de enviar emails", "gemini-2.5-pro") 