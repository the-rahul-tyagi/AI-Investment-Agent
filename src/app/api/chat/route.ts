import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/services/gemini.service";

export async function POST(request: NextRequest) {
  try {
    const { question, report } = await request.json();

    if (!question || !report) {
      return NextResponse.json(
        {
          error: "Question and report are required",
        },
        {
          status: 400,
        }
      );
    }

    const getHeader = (name: string) => {
      const val = request.headers.get(name);
      return val && val !== "null" && val !== "undefined" ? val : undefined;
    };

    const googleKey = getHeader("x-google-key");
    const modelName = getHeader("x-model-name");

    const prompt = `
You are an expert Wall Street investment advisor.

Answer ONLY using the investment report below.

Investment Report:

${JSON.stringify(report, null, 2)}

User Question:

${question}

Rules:

- Give professional investment advice.
- Be concise.
- If the answer is not available in the report, say so.
- Maximum 200 words.
`;

    const model = getGeminiModel(googleKey, modelName);
    const response = await model.invoke(prompt);

    const answer =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to generate answer.",
      },
      {
        status: 500,
      }
    );
  }
}