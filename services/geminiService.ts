import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Mood } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is expected to be available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Rewrites a single tweet based on the selected mood.
 */
export const rewriteSingleTweet = async (text: string, mood: Mood): Promise<string> => {
  try {
    const prompt = `
      You are a social media expert. Rewrite the following tweet to be strictly "${mood}" in tone.
      
      Rules:
      1. Keep it under 280 characters.
      2. Maintain the core message but change the vibe completely to match the mood.
      3. Do not add hashtags unless they are extremely relevant to the mood (e.g. #angry).
      4. Output ONLY the rewritten tweet text. No explanations.
      
      Original Tweet: "${text}"
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.9, // High creativity
      }
    });

    return response.text?.trim() || "Failed to generate tweet.";
  } catch (error) {
    console.error("Error rewriting tweet:", error);
    throw new Error("Failed to connect to Gemini API.");
  }
};

/**
 * Rewrites a long text into a Twitter thread based on the selected mood.
 */
export const rewriteThread = async (text: string, mood: Mood): Promise<string[]> => {
  try {
    const prompt = `
      You are a social media expert. Convert the following text into a Twitter thread (a series of connected tweets).
      The tone should be strictly "${mood}".
      
      Rules:
      1. Break the text into multiple tweets (strings).
      2. Each tweet must be under 280 characters.
      3. Ensure the thread flows logically.
      4. Maintain the core message.
      
      Original Text: "${text}"
    `;

    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "Array of tweets representing the thread",
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from Gemini");
    }

    const thread = JSON.parse(jsonText) as string[];
    return thread;

  } catch (error) {
    console.error("Error rewriting thread:", error);
    throw new Error("Failed to generate thread.");
  }
};