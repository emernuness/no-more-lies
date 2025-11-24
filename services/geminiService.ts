import { GoogleGenAI, Type } from "@google/genai";
import { FactCheckResult, VerificationStatus } from '../types';
import { FACT_PROMPT_SYSTEM, SOURCES_PROMPT_SYSTEM, WHITELIST, BLACKLIST, GOV_PATTERNS, SOURCES_MAX } from '../env';

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

export const checkFact = async (text: string, context?: { segments?: string[]; entities?: string[] }): Promise<Omit<FactCheckResult, 'id' | 'originalText' | 'timestamp'>> => {
  if (!text || text.trim().length < 5) {
     return {
         status: VerificationStatus.UNVERIFIABLE,
         explanation: "Text too short to verify.",
         sources: []
     };
  }

  try {
    const ctxSegments = (context?.segments || []).filter(Boolean).slice(-5);
    const ctxEntities = (context?.entities || []).filter(Boolean).slice(0, 10);
    const ctxText = ctxSegments.join(' | ');
    const entText = ctxEntities.join(', ');
    const factPrompt = `Analise a afirmação a seguir quanto à veracidade.
      Afirmação: "${text}"
      Contexto: "${ctxText}"
      Entidades: ${entText}
      Regras:
      1) Em alegações jurídicas, diferencie 'processo anulado' de 'inocência': anulação por incompetência/parcialidade não equivale a absolvição do mérito. Se a afirmação confundir esses conceitos, classifique como PARTIALLY_TRUE e explique a nuance.
      2) Alegações de manipulação política ou parcialidade institucional exigem múltiplas fontes independentes e imparciais. Sem isso, trate como OPINION ou UNVERIFIABLE.
      3) Priorize fontes independentes; evite considerar como confiáveis fontes oficiais de países com suspeita de censura/manipulação.
      4) Use linguagem neutra e precisa.
      Saída SEMPRE em português do Brasil nas chaves 'explanation' e 'correction'.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: factPrompt }]}],
      config: {
        responseMimeType: "application/json",
        responseSchema: FACT_CHECK_SCHEMA,
        systemInstruction: FACT_PROMPT_SYSTEM || "Você é NML (No More Lies), um verificador de fatos em tempo real. Responda SEMPRE em português do Brasil, de forma neutra e concisa, aplicando a distinção jurídica entre anulação e absolvição, e exigindo fontes independentes para alegações de manipulação política.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const parsed = JSON.parse(jsonText);

    const sources = await fetchImpartialSources(text);

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

const fetchImpartialSources = async (text: string): Promise<Array<{ title: string; uri: string }>> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Encontre fontes imparciais e confiáveis para sustentar uma verificação de fatos da seguinte afirmação: "${text}".
      Priorize organizações independentes, verificadores internacionais, ONGs, artigos acadêmicos e veículos reconhecidos por neutralidade.
      Evite usar fontes oficiais governamentais de países com suspeitas de censura ou manipulação (ex.: Brasil, Rússia, Venezuela, China, Coreia do Norte).`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: SOURCES_PROMPT_SYSTEM || "Liste e fundamente com fontes imparciais. Use a busca para obter referências confiáveis.",
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const raw = chunks
      .filter((c: any) => c.web && c.web.uri)
      .map((c: any) => ({ title: c.web.title || "Fonte", uri: c.web.uri }));

    const filtered = raw.filter(({ uri }) => {
      try {
        const u = new URL(uri);
        const host = u.hostname.toLowerCase();
        const isBlacklisted = BLACKLIST.some((b) => host.includes(b));
        const isGov = GOV_PATTERNS.some((g) => host.includes(g));
        return !isGov && !isBlacklisted;
      } catch {
        return true;
      }
    });

    const whitelist = WHITELIST.length ? WHITELIST : [
      'reuters.com','apnews.com','bbc.co.uk','bbc.com','dw.com','aljazeera.com','poynter.org','ifcncodeofprinciples.poynter.org','fullfact.org','politifact.com','aosfatos.org','projetocomprova.com.br','apublica.org','nexojornal.com.br','revistapiaui.com.br','afp.com','factcheck.afp.com','checamos.afp.com','chequeado.com','humanrightswatch.org','hrw.org','amnesty.org','nature.com','sciencedirect.com','jamanetwork.com','nejm.org','thelancet.com','ssrn.com'
    ];

    const score = (uri: string) => {
      try {
        const host = new URL(uri).hostname.toLowerCase();
        if (whitelist.some(w => host.includes(w))) return 3;
        if (host.includes('.edu') || host.includes('.ac.') || host.endsWith('.org')) return 2;
        return 1;
      } catch {
        return 1;
      }
    };

    const ranked = filtered.sort((a, b) => score(b.uri) - score(a.uri));
    return ranked.slice(0, SOURCES_MAX);
  } catch {
    return [];
  }
};
