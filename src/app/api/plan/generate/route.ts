import { NextRequest, NextResponse } from "next/server";
import { generateItinerary } from "@/lib/itinerary/service";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};

  try {
    const parsed = await req.json();
    if (parsed && typeof parsed === "object") {
      body = parsed as Record<string, unknown>;
    }
  } catch {
    // Use defaults when the request body is absent or malformed.
  }

  const interests = Array.isArray(body.interests)
    ? body.interests.filter(
        (interest): interest is string => typeof interest === "string",
      )
    : [];

  const outcome = await generateItinerary({
    startDate: typeof body.startDate === "string" ? body.startDate : undefined,
    endDate: typeof body.endDate === "string" ? body.endDate : undefined,
    eclipsePreference:
      body.eclipsePreference === "totality" ||
      body.eclipsePreference === "partial" ||
      body.eclipsePreference === "flexible"
        ? body.eclipsePreference
        : undefined,
    pace: typeof body.pace === "string" ? body.pace : undefined,
    budget: typeof body.budget === "string" ? body.budget : undefined,
    groupSize:
      typeof body.groupSize === "number" ? body.groupSize : undefined,
    interests,
  });

  return NextResponse.json(outcome);
}
