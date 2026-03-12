const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const url =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

const TAG_VALUES = [
  "Task",
  "Bug",
  "Enhancement",
  "Research",
  "Design",
  "Testing",
  "Deployment",
  "Documentation",
] as const;

export type Tag = (typeof TAG_VALUES)[number];

export type ClassifyResult = {
  reasoning: string;
  tag: Tag;
};

export async function classifyTask(text: string): Promise<ClassifyResult> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY!,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: "minimal" },
        responseJsonSchema: {
          type: "object",
          additionalProperties: false,
          properties: {
            reasoning: {
              type: "string",
              description: "Short explanation of the tag choice",
            },
            tag: {
              type: "string",
              enum: TAG_VALUES,
            },
          },
          required: ["reasoning", "tag"],
        },
      },
    }),
  });

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error("No response from Gemini");

  return JSON.parse(rawText) as ClassifyResult;
}
