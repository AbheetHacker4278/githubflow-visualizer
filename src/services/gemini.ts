import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => {
  return localStorage.getItem('GEMINI_API_KEY');
};

export const initializeGemini = (apiKey: string) => {
  localStorage.setItem('GEMINI_API_KEY', apiKey);
  console.log('Gemini API key initialized');
};

export const getLanguagePurpose = async (language: string, repoName: string) => {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.error('No Gemini API key found');
      return 'Please set up your Gemini API key first';
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `What is the purpose of using ${language} programming language in the GitHub repository named ${repoName}? Please provide a concise explanation in 2-3 sentences.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(`Gemini response for ${language}:`, text);
    return text;
  } catch (error: any) {
    console.error("Error getting language purpose:", error);
    if (error.message?.includes('API key not valid')) {
      return 'Invalid Gemini API key. Please check your API key.';
    }
    return `Could not fetch purpose for ${language}`;
  }
};