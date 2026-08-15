import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { level = 'intermediate', topic = 'general' } = req.body;

    const prompt = `You are a speech coaching assistant. Generate a reading passage designed to practice English pronunciation, enunciation, and pacing.
    
Difficulty Level: ${level}
Topic: ${topic}

The passage should be approximately 3-5 sentences long. Include some challenging words or varied intonation opportunities appropriate for the difficulty level. Return ONLY the text of the passage, without any markdown formatting or conversational filler.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const generatedText = response.text || "Failed to generate text.";

    return res.status(200).json({ text: generatedText.trim() });
  } catch (error: any) {
    console.error("Error generating text:", error);
    return res.status(500).json({ error: "Failed to generate reading passage." });
  }
}
