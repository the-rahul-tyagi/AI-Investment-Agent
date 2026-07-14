import { NextRequest, NextResponse } from "next/server";
import { investmentService } from "@/services/investment.service";

export async function POST(request: NextRequest) {
  try {
    const { company1, company2 } = await request.json();

    console.log("Comparing:", company1, company2);

    const getHeader = (name: string) => {
      const val = request.headers.get(name);
      return val && val !== "null" && val !== "undefined" ? val : undefined;
    };

    const googleKey = getHeader("x-google-key");
    const fmpKey = getHeader("x-fmp-key");
    const gnewsKey = getHeader("x-gnews-key");
    const modelName = getHeader("x-model-name");

    const report1 = await investmentService.analyze(company1, googleKey, fmpKey, gnewsKey, modelName);
    console.log("Company 1 OK");

    const report2 = await investmentService.analyze(company2, googleKey, fmpKey, gnewsKey, modelName);
    console.log("Company 2 OK");

    return NextResponse.json({
      report1,
      report2,
    });
  } catch (error) {
    console.error("COMPARE ERROR:");
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