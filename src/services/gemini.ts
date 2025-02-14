import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;

// Initialize genAI and model instance once
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * Get the purpose of a programming language in a GitHub repository.
 * @param {string} language - The programming language.
 * @param {string} repoName - The GitHub repository name.
 * @returns {Promise<string>} Purpose explanation
 */
export const getLanguagePurpose = async (language: string, repoName: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API key not found. Please set VITE_GEMINI_KEY in your environment variables.");
    return `Could not fetch purpose for ${language}: Missing API key`;
  }

  const prompt = `What is the purpose of using ${language} programming language in the GitHub repository named ${repoName}? Please provide a concise explanation in 2-3 sentences.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response?.text?.() || "No response text available.";
    
    console.log(`Gemini response for ${language}:`, text);
    return text;
  } catch (error: any) {
    console.error("Error getting language purpose:", error.message || error);
    return `Could not fetch purpose for ${language}: ${error.message || "Unknown error"}`;
  }
};