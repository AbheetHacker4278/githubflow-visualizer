import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, repoUrl, context } = await req.json();
    console.log("Received request with:", { message, repoUrl, context });

    // Create a context-aware system message
    const systemContext = `You are GitViz Assistant, an AI helper for the GitViz application that visualizes GitHub repositories.
    ${repoUrl ? `
    You are currently analyzing this repository: ${repoUrl}
    
    When answering questions about this repository, focus on:
    1. Repository structure and organization
    2. Branch management and commit patterns
    3. Code languages and their distribution
    4. Development activity and collaboration insights
    5. Deployment patterns if available
    
    Always try to reference specific data points from the visualization when possible.
    ` : 'No repository is currently being visualized.'}
    
    Keep responses concise, technical but approachable, and focused on helping users understand their repository structure.`;

    // Convert chat history to Gemini format
    const chatHistory = context.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    console.log("Prepared chat history:", chatHistory);

    // Start a new chat
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage(systemContext + "\n\n" + message);
    const response = result.response;
    const text = response.text();

    console.log("Generated response:", text);

    return new Response(
      JSON.stringify({ response: text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});