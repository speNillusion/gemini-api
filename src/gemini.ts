import * as dotenv from "dotenv";
import { createPartFromUri, createUserContent, FileSource, FileState, FileStatus, GenerateContentResponse, GoogleGenAI } from "@google/genai";
dotenv.config();

interface File_2 {
  /** The `File` resource name. The ID (name excluding the "files/" prefix) can contain up to 40 characters that are lowercase alphanumeric or dashes (-). The ID cannot start or end with a dash. If the name is empty on create, a unique name will be generated. Example: `files/123-456` */
  name?: string;
  /** Optional. The human-readable display name for the `File`. The display name must be no more than 512 characters in length, including spaces. Example: 'Welcome Image' */
  displayName?: string;
  /** Output only. MIME type of the file. */
  mimeType?: string | any;
  /** Output only. Size of the file in bytes. */
  sizeBytes?: string;
  /** Output only. The timestamp of when the `File` was created. */
  createTime?: string;
  /** Output only. The timestamp of when the `File` will be deleted. Only set if the `File` is scheduled to expire. */
  expirationTime?: string;
  /** Output only. The timestamp of when the `File` was last updated. */
  updateTime?: string;
  /** Output only. SHA-256 hash of the uploaded bytes. The hash value is encoded in base64 format. */
  sha256Hash?: string;
  /** Output only. The URI of the `File`. */
  uri?: string | any;
  /** Output only. The URI of the `File`, only set for downloadable (generated) files. */
  downloadUri?: string;
  /** Output only. Processing state of the File. */
  state?: FileState;
  /** Output only. The source of the `File`. */
  source?: FileSource;
  /** Output only. Metadata for a video. */
  videoMetadata?: Record<string, unknown>;
  /** Output only. Error status if File processing failed. */
  error?: FileStatus;
}

type Models =
  | "gemini-1.5-flash"
  | "gemini-2.0-flash"
  | "gemini-2.5-flash"
  | "gemini-2.5-pro";

interface ModelConfig {
  modelName: Models;
  thinkingBudget: number;
}

export class Gemini {
  private apiKey: string | undefined;
  private ai: GoogleGenAI;
  private models: ModelConfig[];

  constructor() {
    //Models Avaibles
    this.models = [
      { modelName: "gemini-2.5-flash", thinkingBudget: 32768 },
      { modelName: "gemini-2.5-pro", thinkingBudget: 32768 },
    ];
    const apiKey: string | undefined = process.env.GEMINI_API_KEY;
    const ai: GoogleGenAI = new GoogleGenAI({
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

  public async getResponseText(
    prompt: string,
    model: Models = "gemini-2.5-flash"
  ): Promise<void> {
    try {
      // Object of Response Stream to All Models
      const response: any = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          tools: [{ codeExecution: {} }],
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
      // for await (const chunk of response) {
      //   for (let i = 0; i < chunk.text.length; i++) {
      //     process.stdout.write(chunk.text[i]);
      //   }
      // }

      const parts: any[] = response?.candidates?.[0]?.content?.parts || [];
      parts.forEach((part) => {
        if (part.text) {
          console.log(part.text);
        }

        if (part.executableCode && part.executableCode.code) {
          console.log(part.executableCode.code);
        }

        if (part.codeExecutionResult && part.codeExecutionResult.output) {
          console.log(part.codeExecutionResult.output);
        }
      });

    } catch (error) {
      throw new Error(`Error generating content: ${error}`);
    }
  }

  public async getResponsePhoto(
    prompt: string,
    model: Models = "gemini-2.5-pro"
  ): Promise<void> {
    try {
      const image: File_2 = await this.ai.files.upload({
        file: "./code.jpg",
      });
      const response: any = await this.ai.models.generateContent({
        model: model,
        contents: [
          createUserContent([
            prompt,
            createPartFromUri(image.uri, image.mimeType),
          ]),
        ],
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

      process.stdout.write(response.text);

    } catch (error) {
      throw new Error(`Error generating content: ${error}`);
    }
  }
}