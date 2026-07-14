import { NextResponse } from "next/server";
import { fmpService } from "@/services/financialModelingPrep.service";

export async function GET() {
  try {
    const company = await fmpService.getCompanyProfile("AAPL");

    return NextResponse.json(company);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch company profile",
      },
      { status: 500 }
    );
  }
}