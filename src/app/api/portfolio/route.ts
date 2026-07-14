import { NextRequest, NextResponse } from "next/server";
import { analyzePortfolio } from "@/agents/portfolio.agent";

export async function POST(request: NextRequest) {
  try {
    const { holdings } = await request.json();

    if (!holdings || !Array.isArray(holdings)) {
      return NextResponse.json(
        {
          error: "Holdings array is required",
        },
        {
          status: 400,
        }
      );
    }

    if (holdings.length === 0) {
      return NextResponse.json(
        {
          error: "Portfolio is empty. Add holdings first.",
        },
        {
          status: 400,
        }
      );
    }

    const analysis = await analyzePortfolio(holdings);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("PORTFOLIO ANALYZER ERROR:");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}
