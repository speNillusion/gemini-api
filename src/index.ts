import Gemini from "./gemini.js";

class Main extends Gemini {
  constructor() {
    super();
  }
}

export default Main;

const main = new Main(); // instance of Main
await main.getResponsePhoto("Me explique sobre essa imagem em poucas palavras.", "gemini-2.5-pro") // check if the secret is set