import { NextResponse } from "next/server";
import { gemini } from "@/services/gemini.service";

export async function GET() {
  try {
    const response = await gemini.invoke(
      "In one sentence, explain why Apple is considered a strong company for long-term investors."
    );

    return NextResponse.json({
      success: true,
      response: response.content,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}