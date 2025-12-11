import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    yearRoundEmployees: { type: Type.STRING, description: "Number of permanent employees. Pure number only." },
    seasonalEmployees: { type: Type.STRING, description: "Number of seasonal employees. Pure number only." },
    numberOfClients: { type: Type.STRING, description: "Number of clients. Pure number only." },
    estimatedRevenue: { type: Type.STRING, description: "Estimated revenue. Pure number only, no formatting." },
    firmIndustry: { type: Type.STRING, description: "The industry of the firm." },
    currentSoftware: { type: Type.STRING, description: "Software currently used and its purpose. Use bullets if multiple." },
    decisionMaker: { type: Type.STRING, description: "Who is the decision maker." },
    buyingTimeline: { type: Type.STRING, description: "When they plan to buy." },
    nextSteps: { type: Type.STRING, description: "Next steps and meeting time. Write as a task for myself." },
    whatResonated: { type: Type.STRING, description: "What features solved their problems." },
    objections: { type: Type.STRING, description: "Real objections mentioned. Use bullets if multiple." },
    painPoints: { type: Type.STRING, description: "Problems and negative impacts. Use bullets." },
    notes: { type: Type.STRING, description: "Interesting facts, location, urgency, competitors. Ignore executive's words." },
    likelihoodToClose: { type: Type.STRING, description: "Score out of 10 (e.g. '5/10')." },
    howTheyFoundUs: { type: Type.STRING, description: "How they found the product." },
  },
  required: [
    "yearRoundEmployees",
    "seasonalEmployees",
    "numberOfClients",
    "estimatedRevenue",
    "firmIndustry",
    "currentSoftware",
    "decisionMaker",
    "buyingTimeline",
    "nextSteps",
    "whatResonated",
    "objections",
    "painPoints",
    "notes",
    "likelihoodToClose",
    "howTheyFoundUs"
  ],
};

const SYSTEM_INSTRUCTION = `
You are a sales rep analyzing a call transcript. You are writing these notes FOR YOURSELF to read later. 

**Tone & Style Rules:**
1.  **Informal & Simple**: Use simple words. Don't use corporate jargon. Write like a human taking quick notes.
2.  **First Person / Direct**: Never say "The prospect said" or "The client wants". Instead, say "They want..." or "She mentioned...".
3.  **Action Oriented**: For "Next Steps", write it as a to-do list for yourself (e.g., "I need to send the proposal...", "Call them back on Tuesday").
4.  **Formatting**: Use bullet points ( - ) freely to make it readable.

**Extraction Rules:**
1.  **Numbers**: For employees/clients, write the PURE NUMBER only (e.g., "5").
2.  **Estimated Revenue**: Calculate based on firm size/industry.
    *   1-5 employees: ~$95k/employee.
    *   5-20 employees: ~$135k/employee.
    *   Return PURE NUMBER only (e.g., "450000").
3.  **Current Software**: Only list what they use *now*.
4.  **Notes**: SKIP what I (the sales rep) said. Only focus on their life, location, urgency, or competitors.
5.  **Likelihood to close**: Just the score (e.g., "8/10").
`;

export const analyzeTranscript = async (transcript: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: transcript,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI.");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing transcript:", error);
    throw error;
  }
};