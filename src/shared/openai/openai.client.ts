import OpenAI from "openai";
import { appConfig } from "../../config/app.config";

export const openai = new OpenAI({
  apiKey: appConfig.openai.apiKey
});