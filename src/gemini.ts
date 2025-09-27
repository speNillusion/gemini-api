import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

type Models =
  | "gemini-1.5-flash"
  | "gemini-2.0-flash"
  | "gemini-2.5-flash"
  | "gemini-2.5-pro";

interface ModelConfig {
  modelName: Models;
  thinkingBudget: number;
}

class Gemini {
  private apiKey: string | undefined;
  private ai: GoogleGenAI;
  private models: ModelConfig[];

  constructor() {
    //Models Avaibles
    this.models = [
      { modelName: "gemini-1.5-flash", thinkingBudget: 8192 },
      { modelName: "gemini-2.0-flash", thinkingBudget: 16384 },
      { modelName: "gemini-2.5-flash", thinkingBudget: 24576 },
      { modelName: "gemini-2.5-pro", thinkingBudget: 32768 },
    ];
    const apiKey: string | undefined = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    if (!apiKey) {
      throw new Error('API key is not set in environment ".env" file.');
    }

    this.apiKey = apiKey;
    this.ai = ai;
  }

  public secretIsSet(): boolean {
    return !!this.apiKey;
  }

  public async getResponse(
    prompt: string,
    model: Models = "gemini-2.5-flash"
  ): Promise<any> {
    try {
      // Object of Response Stream to All Models
      const response: any = await this.ai.models.generateContentStream({
        model: model,
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingBudget:
              this.models.find((m) => m.modelName === model)?.thinkingBudget ||
              8192,
          },
          systemInstruction:
            "You are a helpful feminine assistant called Manu.",
          temperature: 1,
        },
      });
      for await (const chunk of response) {
        for (let i = 0; i < chunk.text.length; i++) {
          process.stdout.write(chunk.text[i]);
        }
      }
    } catch (error) {
      throw new Error(`Error generating content: ${error}`);
    }
  }
}

export default Gemini;
