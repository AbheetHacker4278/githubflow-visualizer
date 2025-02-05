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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, repoUrl, context, visualizationData } = await req.json();
    console.log("Received request with:", { message, repoUrl, context, visualizationData });

    // Create a context-aware system message
    const systemContext = `You are GitViz Assistant, an AI helper for the GitViz application that visualizes GitHub repositories.
    ${repoUrl ? `You are currently analyzing this repository: ${repoUrl}` : 'No repository is currently being visualized.'}
    
    Keep responses concise, technical but approachable, and focused on helping users understand their repository structure.`;

    // Convert chat history to Gemini format
    const chatHistory = context.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    console.log("Using system context:", systemContext);
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