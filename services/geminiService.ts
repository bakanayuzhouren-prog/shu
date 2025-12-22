
import { GoogleGenAI } from "@google/genai";
import { FormData, IllustrationStyle } from "../types";

export const generateGreetingMessage = async (data: FormData): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "【設定エラー】APIキーが設定されていません。VercelのDashboard > Settings > Environment Variables にて「API_KEY」を設定してください。";
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const prompt = `
    世帯主名: ${data.name}
    新住所: ${data.newAddress.prefecture}${data.newAddress.city}
    趣味や楽しみ: ${data.hobbies}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "あなたは温かい雰囲気の挨拶状を書くプロです。新築一戸建てへの引っ越し挨拶状の本文（150文字程度）を作成してください。趣味や楽しみについても触れ、親しみやすく丁寧な言葉遣いにしてください。",
      },
    });
    return response.text || "文章の生成に失敗しました。";
  } catch (error) {
    console.error("Text generation error:", error);
    return "申し訳ありません。アクセスが集中しているか、設定に誤りがあるため文章を生成できませんでした。";
  }
};

export const transformImageToIllustration = async (base64Image: string, style: IllustrationStyle = 'standard'): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("APIキーが設定されていません。Vercelの環境変数を確認してください。");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const base64Data = base64Image.split(',')[1] || base64Image;
  const mimeType = base64Image.substring(base64Image.indexOf(':') + 1, base64Image.indexOf(';')) || 'image/jpeg';

  const prompt = `Convert this photo into a warm watercolor anime style illustration for a moving card. Style: ${style}. Keep the atmosphere happy and protect privacy.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: prompt }
        ]
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("画像が生成されませんでした。");
  } catch (error) {
    console.error("Image transform error:", error);
    throw error;
  }
};

export const editImageWithPrompt = async (base64Image: string, promptText: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("APIキーが設定されていません。");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  // Handle data URI scheme if present
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  const mimeTypeMatch = base64Image.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[0] : 'image/jpeg';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: promptText }
        ]
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("画像が生成されませんでした。");
  } catch (error) {
    console.error("Image edit error:", error);
    throw error;
  }
};
