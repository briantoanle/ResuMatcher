
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { fileData, mimeType } = req.body;

  if (!fileData || !mimeType) {
    return res.status(400).json({ error: 'Missing file data or mime type' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Extract the information from this resume PDF and return it as a JSON object matching the following structure:
    {
      personalInfo: { fullName, email, phone, linkedin, github },
      education: [{ institution, degree, location, dateRange }],
      experience: [{ company, role, location, dateRange, bullets: [] }],
      projects: [{ name, technologies: [], link, bullets: [] }],
      skills: { languages: [], frameworks: [], tools: [], libraries: [] }
    }
    Rules:
    1. Return ONLY valid JSON.
    2. Ensure all fields are present.
    3. Clean up parsing artifacts.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: fileData,
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response from Gemini');
    }

    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedText);

    return res.status(200).json(parsedData);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to parse resume' });
  }
}
