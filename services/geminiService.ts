
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { LearningPath, StudentProfile, ProjectIdea, MindMapNode, StudyNotes, PracticeQuestion, SimplifiedMaterial } from "../types";

const handleApiError = (error: any) => {
  console.error("Gemini API Error:", error);
  if (error.message?.includes("429")) return "System busy. Retrying in 30s...";
  return "Sync failed. Please check your connection.";
};

// Use named parameter for API key initialization
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLearningPath = async (subject: string, profile: StudentProfile): Promise<LearningPath> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a logical 5-step master roadmap for: "${subject}". Context: ${profile.stage} student, Level: ${profile.skillLevel}. Each milestone must be a manageable logical block.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            goal: { type: Type.STRING },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ['locked', 'current', 'completed'] },
                  practicalActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  preventiveAdvice: { type: Type.STRING }
                },
                required: ['id', 'title', 'description', 'status', 'practicalActions', 'preventiveAdvice']
              }
            }
          },
          required: ['subject', 'goal', 'milestones']
        }
      }
    });

    const path = JSON.parse(response.text || '{}') as LearningPath;
    path.id = Math.random().toString(36).substring(2, 11);
    path.stage = profile.stage;
    path.isPublic = true;
    if (path.milestones.length > 0) path.milestones[0].status = 'current';
    return path;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const generateMindMap = async (topic: string): Promise<MindMapNode> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `Create a logical mental map for "${topic}". Focus on how sub-concepts connect to the core logic. Max 2-3 levels.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            label: { type: Type.STRING },
            children: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  children: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, label: { type: Type.STRING } } } }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const generatePracticeExam = async (milestoneTitle: string): Promise<PracticeQuestion[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create 3 diagnostic MCQs for: "${milestoneTitle}". Focus on 'Why' and 'How' rather than 'What'. Provide deep logical explanations for the correct answers.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ['question', 'options', 'correctAnswer', 'explanation']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const generateCustomNotes = async (milestone: string, profile: StudentProfile): Promise<StudyNotes> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `Provide a high-density, pedagogical summary of "${milestone}". Use a supportive tutor tone. Context: ${profile.stage} level. Use markdown for readability.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            concepts: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const simplifyTopic = async (topic: string, stage: string): Promise<SimplifiedMaterial> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain "${topic}" incrementally. 1. A simple analogy. 2. The core mechanism. 3. Best resource to master it. For a ${stage} level student.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['video', 'article'] }
                },
                required: ['title', 'url', 'type']
              }
            }
          },
          required: ['summary', 'keyConcepts', 'resources']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const generateProjectIdeas = async (profile: StudentProfile, subject: string): Promise<ProjectIdea[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 3 project prototypes for a ${profile.stage} student learning "${subject}". Level: ${profile.skillLevel}. Focus on utility and immediate logic application.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
              whyThis: { type: Type.STRING }
            },
            required: ['title', 'description', 'difficulty', 'whyThis']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const generateVisionImage = async (prompt: string, aspectRatio: string): Promise<string> => {
  try {
    const ai = getAI();
    const validRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const selectedRatio = validRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: selectedRatio as any,
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image was generated.");
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const getMentorAdviceStream = async function* (message: string, profile: StudentProfile, imageB64?: string, isThinking?: boolean) {
  try {
    const ai = getAI();
    const parts: any[] = [{ text: message }];
    if (imageB64) parts.push({ inlineData: { mimeType: "image/jpeg", data: imageB64 } });

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction: `You are Lumina, a pedagogical Architect. Your goal is to guide ${profile.name} through their learning journey. Tone: Encouraging, precise, and step-by-step. If asked for a solution, guide them through the logic first. Current Stage: ${profile.stage}.`,
        thinkingConfig: isThinking ? { thinkingBudget: 32768 } : undefined
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) yield chunk.text;
    }
  } catch (err) {
    yield handleApiError(err);
  }
};

export const generateSpeech = async (text: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
};

export const encodeBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export const decodeBase64 = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

export const decodeAudioData = async (data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
  return buffer;
};
