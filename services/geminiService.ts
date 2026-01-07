
import { GoogleGenAI, Type } from "@google/genai";
import { LearningPath, StudentProfile } from "../types";

// Always use named parameter for initialization and process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLearningPath = async (subject: string, profile: StudentProfile): Promise<LearningPath> => {
  // Use gemini-3-pro-preview for complex reasoning tasks like stage-aware learning roadmaps
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a STAGE-AWARE learning path for ${subject}. 
    Student Profile: ${profile.stage} year, ${profile.skillLevel} level. 
    Ultimate Goal: ${profile.primaryGoal}.
    
    Principles:
    1. Clarity-First: Provide one clear focus per milestone.
    2. Action-Oriented: Focus on small, practical actions, not long theory.
    3. Preventive: Include 'preventiveAdvice' for each milestone to help the student avoid common wrong choices at this specific stage.`,
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
                status: { type: Type.STRING },
                practicalActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                preventiveAdvice: { type: Type.STRING, description: 'Advice to avoid mistakes before they happen.' }
              },
              required: ['id', 'title', 'description', 'status', 'practicalActions']
            }
          }
        },
        required: ['subject', 'goal', 'milestones']
      }
    }
  });

  // Access .text property directly (do not call as a method)
  const text = response.text || '{}';
  const path = JSON.parse(text) as LearningPath;
  path.stage = profile.stage;
  return path;
};

export const getMentorAdvice = async (history: {role: string, content: string}[], message: string, profile: StudentProfile) => {
  // Basic Q&A can use gemini-3-flash-preview
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are Lumina, a Stage-Aware AI Learning Mentor. 
      The student is a ${profile.stage} at a ${profile.skillLevel} level.
      Your mission:
      - Reduce Decision Fatigue: Give ONE clear best next step.
      - Comparison-Free: Never compare them to others. Focus on their personal growth.
      - Preventive Guidance: Warn them about potential wrong turns based on their current progress.
      - Keep it simple and action-oriented.`
    }
  });

  // sendMessage accepts a message string parameter
  const response = await chat.sendMessage({ message });
  return response.text;
};
