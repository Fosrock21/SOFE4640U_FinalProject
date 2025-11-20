import { GEMINI_API_KEY, SPEECH_TO_TEXT_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system/legacy';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`;
const SPEECH_TO_TEXT_API_URL = `https://speech.googleapis.com/v1/speech:recognize?key=${SPEECH_TO_TEXT_API_KEY}`;

export const transcribeAudio = async (audioUri) => {
  if (SPEECH_TO_TEXT_API_KEY === 'YOUR_SPEECH_TO_TEXT_API_KEY') {
    return "Please replace the Speech-to-Text API key in services/GeminiService.js to enable audio transcription.";
  }

  try {
    const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
      encoding: 'base64',
    });

    const response = await fetch(SPEECH_TO_TEXT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: 'MP4',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
        },
        audio: {
          content: audioBase64,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Speech-to-Text API Error:", errorBody);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const transcription = data.results?.[0]?.alternatives?.[0]?.transcript;

    if (!transcription) {
      console.error("Invalid response structure:", data);
      throw new Error("Failed to parse response from Speech-to-Text API.");
    }

    return transcription;

  } catch (error) {
    console.error('Failed to call Speech-to-Text API:', error);
    return "Sorry, I'm having trouble transcribing the audio. Please try again later.";
  }
};

export const callGeminiWithText = async (text) => {
  if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    return "Hello! I am a hotel booking assistant. Please replace the API key in services/GeminiService.js to enable my full capabilities.";
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: text }],
        }],
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