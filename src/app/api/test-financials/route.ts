import { NextResponse } from "next/server";
import { fmpService } from "@/services/financialModelingPrep.service";

export async function GET() {
  try {
    const financials =
      await fmpService.getFinancialMetrics("AAPL");

    return NextResponse.json(financials);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to fetch financials",
      },
      {
        status: 500,
      }
    );
  }
}