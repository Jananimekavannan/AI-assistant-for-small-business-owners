import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const generateContent = action({
  args: {
    businessType: v.string(),
    businessDescription: v.string(),
    targetAudience: v.string(),
    taskType: v.string(),
    tone: v.string(),
    extraContext: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const systemPrompt = `You are an AI assistant for small business owners.
Business Type: ${args.businessType}
Business Description: ${args.businessDescription}
Target Audience: ${args.targetAudience}
Task: ${args.taskType}
Tone: ${args.tone}

Instructions:
• Use simple and clear language
• Keep it suitable for WhatsApp / Instagram
• Avoid technical jargon
• Make it customer-friendly
• Keep it concise and actionable

Output: Provide a ready-to-use response without explanations. Just the content, nothing else.`;

    const userMessage = args.extraContext
      ? `Generate the content. Additional context: ${args.extraContext}`
      : "Generate the content now.";

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    return response.choices[0].message.content ?? "";
  },
});
