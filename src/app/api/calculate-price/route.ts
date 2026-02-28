import { NextRequest, NextResponse } from "next/server";
import { calculateCustomPrice } from "@/lib/utils";
import type { StandardSize } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { width, height, standardSizes, surcharge } = body as {
      width: number;
      height: number;
      standardSizes: StandardSize[];
      surcharge: number;
    };

    if (!width || !height || !standardSizes || surcharge == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = calculateCustomPrice(width, height, standardSizes, surcharge);

    if (!result) {
      return NextResponse.json(
        { error: "No standard size available that covers these dimensions" },
        { status: 422 }
      );
    }

    return NextResponse.json({
      price: result.price,
      matchedSize: result.matchedSize,
    });
  } catch (error) {
    console.error("Price calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate price" },
      { status: 500 }
    );
  }
}
