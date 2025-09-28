import { Gemini } from "./gemini.js";

export class Main extends Gemini {
  constructor() {
    super();
  }
}

const main = new Main(); // instance of Main
await main.getResponseText("Oi tudo bem?", "gemini-2.5-pro") 