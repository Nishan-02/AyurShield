
import { GoogleGenAI } from "@google/genai";
import { InteractionStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getAIInteractionAnalysis = async (medicine: string, herb: string, status: InteractionStatus): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    Act as a clinical pharmacologist with expertise in Ayurvedic herb-drug interactions.
    Analyze the interaction between the modern pharmaceutical "${medicine}" and the Ayurvedic herb "${herb}". 
    The preliminary safety assessment is: ${status}.
    
    In 2-3 professional sentences:
    1. Identify the likely mechanism of interaction.
    2. Explain the physiological risk.
    3. Provide a medical advisory.
  `;

  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating AI analysis.";
  }
};

export const analyzeFoodImage = async (
  base64Image: string,
  mimeType: string,
  context: { season: string; time: string; location: string; userDosha: string }
): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    Act as an Ayurvedic Nutritionist. Analyze this food image.
    Context:
    - Current Season: ${context.season}
    - Time of Day: ${context.time}
    - User's Dosha: ${context.userDosha}
    - Location: ${context.location}

    Analyze the ingredients visible or likely present. 
    1. Determine if it is healthy for this specific user given the context (Season and Dosha).
    2. Suggest Ayurvedic modifications (e.g., adding certain spices).
    3. Rate it on a scale of 1-10 for the current time of day.
    Keep response concise and formatted in professional Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: prompt }
        ]
      }
    });
    return response.text || "Could not analyze the image.";
  } catch (error) {
    console.error("Gemini Food Analysis Error:", error);
    return "Failed to process food image.";
  }
};

export const getAyurBotResponse = async (history: { role: string; parts: { text: string }[] }[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are AyurBot, a helpful Ayurvedic health assistant. You provide wellness tips, herb info, and lifestyle advice based on traditional wisdom. Keep answers concise and friendly. Always remind users to consult a doctor for serious medical issues.",
    }
  });

  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("AyurBot Error:", error);
    return "I'm having trouble connecting right now. How else can I help?";
  }
};
