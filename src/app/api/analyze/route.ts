import { NextRequest, NextResponse } from "next/server";
import { investmentService } from "@/services/investment.service";

export async function POST(request: NextRequest) {
  try {
    const { company } = await request.json();

    if (!company) {
      return NextResponse.json(
        {
          error: "Company is required",
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
    const fmpKey = getHeader("x-fmp-key");
    const gnewsKey = getHeader("x-gnews-key");
    const modelName = getHeader("x-model-name");

    const report = await investmentService.analyze(company, googleKey, fmpKey, gnewsKey, modelName);

    return NextResponse.json(report);
  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.stack
              : null
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}