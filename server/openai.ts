import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateKuralInterpretation(
  tamil: string,
  english: string
): Promise<string> {
  try {
    console.log("Attempting to generate interpretation for:", { tamil, english });

    const response = await openai.chat.completions.create({
      model: "gpt-4", // Changed from gpt-4o to standard gpt-4
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

    if (!response.choices[0]?.message?.content) {
      console.error("OpenAI response missing content:", response);
      throw new Error("No interpretation content in response");
    }

    const interpretation = response.choices[0].message.content;
    console.log("Successfully generated interpretation:", interpretation);
    return interpretation;

  } catch (error: any) {
    console.error("OpenAI API error details:", {
      error: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
    });
    throw new Error(`Failed to generate interpretation: ${error.message}`);
  }
}