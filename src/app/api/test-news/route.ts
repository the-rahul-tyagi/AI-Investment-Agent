import { NextResponse } from "next/server";
import { gnewsService } from "@/services/gnews.service";

export async function GET() {
  try {
    const news = await gnewsService.getCompanyNews("Apple");

    return NextResponse.json(news);
  } catch (error: any) {
    console.error("TEST NEWS ERROR:", error?.response?.data);
    console.error("STATUS:", error?.response?.status);

    return NextResponse.json(
      {
        success: false,
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}