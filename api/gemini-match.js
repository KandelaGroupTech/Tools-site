import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    if (getApps().length === 0) {
      if (!process.env.FIREBASE_PROJECT_ID) {
        throw new Error('FIREBASE_PROJECT_ID is not set in Vercel environment variables.');
      }
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Firebase Init Error', message: e.message });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not set in Vercel environment variables.' });
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const ALLOWED_EMAIL = process.env.CLIENT_EMAIL;

  const { idToken, prompt, catalogContext } = req.body;

  if (!idToken) {
    return res.status(401).json({ error: 'Missing Firebase ID token' });
  }

  if (!prompt || !catalogContext) {
    return res.status(400).json({ error: 'Missing prompt or catalogContext' });
  }

  try {
    // 1. Verify the Firebase ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    
    // Check if email is verified and matches the allowlist (if configured)
    if (!decodedToken.email_verified) {
        return res.status(403).json({ error: 'Email not verified' });
    }
    
    if (ALLOWED_EMAIL && decodedToken.email !== ALLOWED_EMAIL && !decodedToken.email.endsWith('@excellentjob.com')) {
        return res.status(403).json({ error: 'Unauthorized email' });
    }

    // 2. Call Gemini
    const systemInstruction = `You are an expert construction estimator matching plain-English descriptions to a master scope checklist.
This is JOB's 1995 16-division MasterFormat TI cost catalog.
Return up to 5 candidates, best first.
Do not invent cost codes. Every costCode returned MUST match a costCode in the provided catalog context EXACTLY.
If nothing is a reasonable match, return an empty array. Do not force a match.`;

    const fullPrompt = `Catalog Context:\n${catalogContext}\n\nUser Scope Sentence: "${prompt}"`;

    const responseSchema = {
        type: Type.ARRAY,
        description: "List of matched candidate cost codes",
        items: {
            type: Type.OBJECT,
            properties: {
                costCode: {
                    type: Type.STRING,
                    description: "The exact zero-padded cost code from the catalog (e.g., '09250-01')"
                },
                confidence: {
                    type: Type.INTEGER,
                    description: "Confidence score from 0 to 100"
                },
                reason: {
                    type: Type.STRING,
                    description: "One short sentence explaining why this is a match"
                }
            },
            required: ["costCode", "confidence", "reason"]
        }
    };

    const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: fullPrompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.1, // low temperature for classification
        }
    });

    const responseText = response.text;
    let candidates = [];
    try {
        candidates = JSON.parse(responseText);
    } catch (e) {
        console.error("Failed to parse Gemini response:", responseText);
        return res.status(500).json({ error: 'Invalid response from AI' });
    }

    return res.status(200).json({ candidates });

  } catch (error) {
    console.error('Error in gemini-match function:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error', stack: error.stack });
  }
}
