import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Mood } from "../types";

// Get API key from environment
// Vite's define replaces process.env.API_KEY at build time
// Also check import.meta.env.VITE_GEMINI_API_KEY (Vite's standard way)
const getApiKey = (): string => {
  // Try multiple sources for the API key
  const apiKey = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.API_KEY) || 
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    '';
  
  // Check if API key is valid (not empty, not the string "undefined")
  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY is not set. Please create a .env file in the at-tweet-rewriter directory with: GEMINI_API_KEY=your_api_key');
  }
  
  return apiKey;
};

// Lazy initialization - only create client when needed
let aiInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: getApiKey() });
  }
  return aiInstance;
};

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

    const ai = getAI();
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

    const ai = getAI();
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