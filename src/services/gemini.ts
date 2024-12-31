import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyD7tGADeRlGAIB7jVihfOqrFKWyQwuyx2Q";
const genAI = new GoogleGenerativeAI(API_KEY);

export const getLanguagePurpose = async (language: string, repoName: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `What is the purpose of using ${language} programming language in the GitHub repository named ${repoName}? Please provide a concise explanation in 2-3 sentences.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(`Gemini response for ${language}:`, text);
    return text;
  } catch (error: any) {
    console.error("Error getting language purpose:", error);
    return `Could not fetch purpose for ${language}`;
  }
};