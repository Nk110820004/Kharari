import { GoogleGenAI, Type } from "@google/genai";

// This would be in a .env file in a real application
// For Vite, environment variables are exposed on import.meta.env
// FIX: Cast `import.meta` to `any` to access `env` property without Vite client types.
const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is not set. Please create a .env file and add VITE_GEMINI_API_KEY=YOUR_KEY.");
}
const ai = new GoogleGenAI({ apiKey: apiKey });

// --- Type Definitions ---
export interface RoadmapTile {
  title: string;
  description: string;
  concepts: string[];
  youtubeSearchQuery: string;
}

export interface Roadmap {
  tiles: RoadmapTile[];
}

export interface Suggestions {
    suggestions: string[];
}

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

export interface Quiz {
    questions: QuizQuestion[];
}

export interface ChatMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

export interface ResumeAnalysis {
    atsScore: number;
    feedback: string[];
}

export interface EnhancedResume {
    enhancedMarkdown: string;
}


// --- JSON Schemas for Gemini ---

const roadmapSchema = {
  type: Type.OBJECT,
  properties: {
    tiles: {
      type: Type.ARRAY,
      description: "A list of learning modules or tiles.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "The concise title of the learning module." },
          description: { type: Type.STRING, description: "A brief, one-sentence description of what the user will learn in this module." },
          concepts: {
            type: Type.ARRAY,
            description: "A list of 3-5 key concepts, skills, or topics covered in this module.",
            items: { type: Type.STRING },
          },
          youtubeSearchQuery: {
            type: Type.STRING,
            description: "A concise, effective YouTube search query to find tutorial videos for the concepts in this tile. e.g., 'JavaScript variables tutorial for beginners'."
          }
        },
        required: ["title", "description", "concepts", "youtubeSearchQuery"],
      },
    },
  },
  required: ["tiles"],
};

const suggestionsSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            description: "A list of 3-5 topic suggestions as strings.",
            items: { type: Type.STRING }
        }
    },
    required: ["suggestions"],
};

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "A list of 15-25 multiple-choice quiz questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The text of the quiz question." },
                    options: { 
                        type: Type.ARRAY, 
                        description: "An array of 4 strings representing the possible answers.",
                        items: { type: Type.STRING }
                    },
                    answer: { type: Type.STRING, description: "The correct answer, which must exactly match one of the strings in the 'options' array." }
                },
                required: ["question", "options", "answer"]
            }
        }
    },
    required: ["questions"]
};

const resumeAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        atsScore: {
            type: Type.INTEGER,
            description: "An estimated Applicant Tracking System (ATS) score from 0 to 100, based on clarity, keywords, and structure."
        },
        feedback: {
            type: Type.ARRAY,
            description: "A list of 3-4 specific, actionable feedback points to improve the resume.",
            items: { type: Type.STRING }
        }
    },
    required: ["atsScore", "feedback"]
};

const enhancedResumeSchema = {
    type: Type.OBJECT,
    properties: {
        enhancedMarkdown: {
            type: Type.STRING,
            description: "The full, rewritten resume in markdown format, incorporating the suggested improvements."
        }
    },
    required: ["enhancedMarkdown"]
};


// --- API Functions ---

export const generateRoadmap = async (topic: string, lang: 'en'|'hi'|'ta'|'ml' = 'en'): Promise<Roadmap> => {
  const langInstruction = lang === 'en' ? 'Write in English.' : `Write all titles, descriptions, and YouTube search queries in ${lang}.`;
  const prompt = `Create a detailed, step-by-step learning roadmap for a beginner on the topic of "${topic}". The target audience is between 18 and 35 years old, so the tone should be encouraging, modern, and clear. Break down the topic into 5-7 logical, sequential modules or "tiles". For each tile, provide a clear title, a one-sentence description, a list of 3-5 key concepts, and a concise, effective YouTube search query to find tutorial videos for the concepts. Ensure the path flows logically from fundamental principles to more advanced applications. ${langInstruction}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: roadmapSchema,
      },
    });

    const roadmapText = response.text.trim();
    if (!roadmapText) {
        throw new Error("Received an empty response from the API.");
    }

    return JSON.parse(roadmapText);
  } catch (error) {
    console.error("Error generating roadmap with Gemini:", error);
    throw new Error("Failed to generate roadmap. The AI model may be temporarily unavailable or the topic could not be processed.");
  }
};


export const generateTopicSuggestions = async (query: string): Promise<Suggestions> => {
    const prompt = `Based on the user's input "${query}", generate 4 relevant and interesting autocompletion suggestions for learning topics. Keep the suggestions concise.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: suggestionsSchema
            }
        });
        const suggestionsText = response.text.trim();
        if (!suggestionsText) {
            return { suggestions: [] };
        }
        return JSON.parse(suggestionsText);

    } catch (error) {
        console.error("Error generating topic suggestions:", error);
        return { suggestions: [] };
    }
};

export const generateFurtherTopics = async (originalTopic: string): Promise<Suggestions> => {
    const prompt = `A user has just completed a learning roadmap for "${originalTopic}". Suggest 3 related or more advanced topics they could learn next to continue their journey.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: suggestionsSchema
            }
        });
        const suggestionsText = response.text.trim();
         if (!suggestionsText) {
            return { suggestions: [] };
        }
        return JSON.parse(suggestionsText);

    } catch (error) {
        console.error("Error generating further topics:", error);
        return { suggestions: [] };
    }
};

export const generateQuiz = async (tile: RoadmapTile): Promise<Quiz> => {
    const prompt = `Create a multiple-choice quiz with 15-25 questions to test understanding of the following topic: "${tile.title}". The quiz should cover these specific concepts: ${tile.concepts.join(", ")}. For each question, provide 4 options and clearly indicate the correct answer. The questions should be suitable for a beginner who has just studied this topic.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            }
        });
        const quizText = response.text.trim();
        if (!quizText) {
            throw new Error("Received an empty quiz response from the API.");
        }
        const quizData = JSON.parse(quizText);
        // Basic validation
        if (!quizData.questions || quizData.questions.length === 0) {
            throw new Error("Generated quiz data is invalid or empty.");
        }
        return quizData;
    } catch(error) {
        console.error("Error generating quiz with Gemini:", error);
        throw new Error("Failed to generate quiz. The AI model may be temporarily unavailable.");
    }
};

export const generateChatResponse = async (history: ChatMessage[]): Promise<string> => {
  const systemInstruction = `You are Kael, a friendly, encouraging, and helpful female AI study assistant for the platform Khalari.
- Keep your responses concise, conversational, and easy to understand.
- Always detect the language of the user's very last message and respond in that same language.
- Your primary goal is to help users with their learning questions. You can answer questions about study topics, explain concepts, or give learning advice.
- Do not answer questions that are not related to learning or education.`;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
      history,
    });
    
    const latestUserMessage = history[history.length - 1].parts[0].text;

    const response = await chat.sendMessage({ message: latestUserMessage });
    
    return response.text;
  } catch (error) {
    console.error("Error generating chat response from Gemini:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
};

export const analyzeResume = async (resumeMarkdown: string): Promise<ResumeAnalysis> => {
    const prompt = `Analyze the following resume provided in markdown format. Act as an expert career coach and an Applicant Tracking System (ATS). Provide an estimated ATS score between 0 and 100 based on keyword optimization, structure, clarity, and impact. Also, provide 3-4 specific, actionable feedback points for improvement.

Resume:
---
${resumeMarkdown}
---`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumeAnalysisSchema,
            }
        });
        const analysisText = response.text.trim();
        return JSON.parse(analysisText);
    } catch (error) {
        console.error("Error analyzing resume with Gemini:", error);
        throw new Error("Failed to analyze resume.");
    }
};

export const enhanceResume = async (resumeMarkdown: string, feedback: string[]): Promise<EnhancedResume> => {
    const prompt = `Rewrite and enhance the following resume based on the provided feedback. Incorporate the suggestions to improve clarity, impact, and keyword relevance. Ensure the output is a complete resume in the same markdown format as the original.

Original Resume:
---
${resumeMarkdown}
---

Feedback to incorporate:
- ${feedback.join("\n- ")}
---
`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: enhancedResumeSchema,
            }
        });
        const enhancedText = response.text.trim();
        return JSON.parse(enhancedText);
    } catch (error) {
        console.error("Error enhancing resume with Gemini:", error);
        throw new Error("Failed to enhance resume.");
    }
};
