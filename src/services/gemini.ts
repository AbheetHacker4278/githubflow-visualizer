import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("YOUR_API_KEY"); // Replace with your actual API key

export const getLanguagePurpose = async (language: string, repoName: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `What is the purpose of using ${language} programming language in the GitHub repository named ${repoName}? Please provide a concise explanation in 2-3 sentences.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(`Gemini response for ${language}:`, text);
    return text;
  } catch (error) {
    console.error("Error getting language purpose:", error);
    return `Could not fetch purpose for ${language}`;
  }
};