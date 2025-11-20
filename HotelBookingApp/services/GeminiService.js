const API_KEY = 'AIzaSyButG94nCT3q8TjsdEbTivagUMcsUgHVc0';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export const callGemini = async (messages) => {
  if (API_KEY === 'YOUR_GEMINI_API_KEY') {
    return "Hello! I am a hotel booking assistant. Please replace the API key in services/GeminiService.js to enable my full capabilities.";
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages
          .filter((msg, index) => !(index === 0 && msg.role === 'model')) // Filter out the initial model message
          .map(msg => ({
            role: msg.role,
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
