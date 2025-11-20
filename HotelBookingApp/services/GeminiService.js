import { GEMINI_API_KEY } from '@env';

const GEMINI_MODEL = 'gemini-2.0-flash-exp';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export const callGemini = async (messages) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    // Return a canned response if the API key hasn't been replaced.
    return "Hello! I am a hotel booking assistant. Please replace the API key in services/GeminiService.js to enable my full capabilities.";
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model', // Gemini uses 'user' and 'model' roles
          parts: [{ text: msg.text }],
        })),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("API Error:", errorBody);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Extract the text from the first candidate's content
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!botResponse) {
      console.error("Invalid response structure:", data);
      throw new Error("Failed to parse response from API.");
    }

    return botResponse;

  } catch (error) {
    console.error('Failed to call Gemini API:', error);
    return "Sorry, I'm having trouble connecting. Please try again later.";
  }
};