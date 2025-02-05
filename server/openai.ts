import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateKuralInterpretation(
  tamil: string,
  english: string
): Promise<string> {
  try {
    console.log("Generating interpretation for:", { tamil, english });
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a witty interpreter of ancient Tamil wisdom. Create a fun, modern interpretation of the given Thiruvalluvar's Kural while maintaining respect for its wisdom. Keep it under 280 characters. Make it relatable to modern life."
        },
        {
          role: "user",
          content: `Tamil: ${tamil}\nEnglish: ${english}`
        }
      ],
      temperature: 0.8,
      max_tokens: 150
    });

    const interpretation = response.choices[0].message.content;
    if (!interpretation) {
      throw new Error("No interpretation generated");
    }
    console.log("Generated interpretation:", interpretation);
    return interpretation;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate interpretation");
  }
}