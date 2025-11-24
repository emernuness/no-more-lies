import { GoogleGenAI, Type } from "@google/genai";
import { FactCheckResult, VerificationStatus } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

// Define the response schema strictly to ensure easy UI rendering
const FACT_CHECK_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      enum: ['TRUE', 'FALSE', 'PARTIALLY_TRUE', 'UNVERIFIABLE', 'OPINION'],
      description: "The verdict on the factual accuracy of the statement.",
    },
    explanation: {
      type: Type.STRING,
      description: "A brief, neutral explanation of why the status was chosen.",
    },
    correction: {
      type: Type.STRING,
      description: "If status is FALSE or PARTIALLY_TRUE, provide the correct information. Otherwise, leave empty.",
    },
  },
  required: ['status', 'explanation'],
};

export const checkFact = async (text: string): Promise<Omit<FactCheckResult, 'id' | 'originalText' | 'timestamp'>> => {
  if (!text || text.trim().length < 5) {
     return {
         status: VerificationStatus.UNVERIFIABLE,
         explanation: "Text too short to verify.",
         sources: []
     };
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze the following statement for factual accuracy using Google Search. 
      Statement: "${text}"
      
      If it is a subjective opinion, classify as OPINION.
      If it is a clear falsehood, classify as FALSE and provide the truth.
      If it is true, classify as TRUE.
      
      Be extremely rigorous and neutral.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: FACT_CHECK_SCHEMA,
        systemInstruction: "You are NML (No More Lies), a real-time professional fact-checking AI. Your goal is to identify misinformation instantly. Be concise.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const parsed = JSON.parse(jsonText);
    
    // Extract grounding chunks (sources)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web && chunk.web.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || "Source",
        uri: chunk.web.uri,
      }));

    return {
      status: parsed.status as VerificationStatus,
      explanation: parsed.explanation,
      correction: parsed.correction,
      sources: sources,
    };

  } catch (error) {
    console.error("Fact Check Error:", error);
    return {
        status: VerificationStatus.UNVERIFIABLE,
        explanation: "Could not verify at this time due to technical error.",
        sources: []
    };
  }
};