import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, EmailSequenceResult, EmailSettings } from "../types";

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

const emailSequenceSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    emails: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          body: { type: Type.STRING },
          recommendedDate: { type: Type.STRING },
        },
        required: ["subject", "body", "recommendedDate"],
      },
    },
  },
  required: ["emails"],
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

export const generateEmailSequence = async (transcript: string, settings: EmailSettings): Promise<EmailSequenceResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const EMAIL_SYSTEM_INSTRUCTION = `
You are a sales expert writing a 6-touch-point email sequence based on the transcript.

**Core Philosophy:**
1.  **Remove Friction**: Make it effortless for them to reply.
2.  **Curiosity, Not Pressure**: Do not "check in". Do not "follow up". Ignite curiosity or ask a simple binary question.
3.  **Mandatory**: Every single email MUST end with a question or a clear call to action.

**Strict Constraints:**
1.  **NO LINKS**: Do not include URL placeholders or brackets [Link]. The email must be copy-paste ready.
2.  **NO PLACEHOLDERS**: Do not use [Insert Date] or [Insert Name] unless absolutely necessary.
3.  **NO EMOJIS**: Do not use any emojis in the subject or body.
4.  **Length**: ${settings.brevity === 'brief' ? 'Ultra short (1-2 sentences max)' : 'Short (3-4 sentences max)'}.
5.  **Tone**: ${settings.tone === 'casual' ? 'Relaxed, lowercase subject lines ok, start with "Hey"' : 'Professional but human, standard capitalization'}.
6.  **Directness**: ${settings.directness === 'direct' ? 'Get straight to the point. Bold.' : 'Softer approach, more "I was wondering..."'}.
7.  **Focus**: ${settings.focus === 'value' ? 'Focus on the specific problem they mentioned (Pain Points).' : 'Focus on the relationship and timing.'}.
8.  **Urgency**: ${settings.urgency === 'urgent' ? 'Imply a timeline or scarcity.' : 'Patient, "when you are ready" vibe.'}.

**Sequence Logic:**
- Email 1: The Recap (Simple verification of understanding).
- Email 2: The Resource (Mention a solution to their specific pain point *without* a link, just ask if they want to see it).
- Email 3: The Soft Suggestion (Soft nudge).
- Email 4: The 9-Word Email (e.g., "Are you still looking to solve [problem]?").
- Email 5: Future Pacing (Imagining the result).
- Email 6: The Break-up (e.g., "Have you given up on...?").

Output a JSON object with an array of emails.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: transcript,
      config: {
        systemInstruction: EMAIL_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: emailSequenceSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI.");
    }

    return JSON.parse(text) as EmailSequenceResult;
  } catch (error) {
    console.error("Error generating emails:", error);
    throw error;
  }
};