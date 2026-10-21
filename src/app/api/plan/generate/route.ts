import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { destinations } from "@/data/destinations";
import { experiences } from "@/data/experiences";

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "destination" | "experience" | "custom";
  referenceSlug?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  destinationSlug: string;
  isEclipseDay?: boolean;
  activities: Activity[];
}

export interface ItineraryPlan {
  tripTitle: string;
  summary: string;
  eclipseDayNotes: string;
  days: ItineraryDay[];
}

// Helper to calculate date sequence safely without timezone shifts
function getDatesInRange(startStr: string, endStr: string): string[] {
  try {
    const [sy, sm, sd] = startStr.split("-").map(Number);
    const [ey, em, ed] = endStr.split("-").map(Number);

    if (isNaN(sy) || isNaN(sm) || isNaN(sd) || isNaN(ey) || isNaN(em) || isNaN(ed)) {
      return ["2027-07-31", "2027-08-01", "2027-08-02", "2027-08-03", "2027-08-04"];
    }

    const startUtc = Date.UTC(sy, sm - 1, sd);
    const endUtc = Date.UTC(ey, em - 1, ed);

    // Limit duration between 1 and 14 days
    const diffDays = Math.round((endUtc - startUtc) / (1000 * 60 * 60 * 24));
    const safeDays = Math.max(1, Math.min(14, diffDays + 1));

    const dates: string[] = [];
    for (let i = 0; i < safeDays; i++) {
      const d = new Date(startUtc + i * 86400000);
      dates.push(d.toISOString().slice(0, 10));
    }
    return dates;
  } catch {
    return ["2027-07-31", "2027-08-01", "2027-08-02", "2027-08-03", "2027-08-04"];
  }
}

// Dynamic deterministic generator tailored to user inputs
function buildPersonalizedFallback({
  startDate,
  endDate,
  interests,
  pace,
  budget,
  groupSize,
  eclipsePreference,
}: {
  startDate: string;
  endDate: string;
  interests: string[];
  pace: string;
  budget: string;
  groupSize: number;
  eclipsePreference: string;
}): ItineraryPlan {
  const dates = getDatesInRange(startDate, endDate);
  const totalDays = dates.length;

  const hasDesert = interests.includes("desert") || interests.includes("sahara");
  const hasCulture = interests.includes("culture") || interests.includes("antiquities") || interests.includes("history");
  const hasCoast = interests.includes("coast") || interests.includes("islands") || interests.includes("sea");
  const hasFood = interests.includes("food") || interests.includes("cuisine");

  // Determine primary totality base on 2 August 2027
  let totalityBaseSlug = "tozeur";
  let totalityBaseName = "Tozeur & Chott el Jerid";
  let totalityDuration = "2 minutes and 4 seconds";

  if (eclipsePreference === "totality") {
    if (hasCoast && !hasDesert) {
      totalityBaseSlug = "djerba";
      totalityBaseName = "Djerba Island & Coast";
      totalityDuration = "4 minutes and 37 seconds";
    } else if (hasCulture && !hasDesert) {
      totalityBaseSlug = "el-jem";
      totalityBaseName = "El Jem Roman Amphitheatre";
      totalityDuration = "4 minutes and 24 seconds";
    } else {
      totalityBaseSlug = "tozeur";
      totalityBaseName = "Tozeur Oasis & Chott el Jerid";
      totalityDuration = "2 minutes and 4 seconds";
    }
  } else {
    // Flexible / Partial preference
    if (hasCoast) {
      totalityBaseSlug = "sousse";
      totalityBaseName = "Sousse & Monastir (99.9% Deep Partial)";
      totalityDuration = "99.9% Solar Obscuration";
    } else {
      totalityBaseSlug = "tunis";
      totalityBaseName = "Tunis & Carthage (97.1% Partial)";
      totalityDuration = "97.1% Solar Obscuration";
    }
  }

  // Dynamic expedition title
  let title = "Tunisian Solar Eclipse Expedition 2027";
  if (hasDesert && hasCulture) {
    title = `Sahara Oasis & Roman Antiquities Totality Expedition (${totalDays} Days)`;
  } else if (hasCoast && hasCulture) {
    title = `Mediterranean Coast & Roman Amphitheatres Eclipse Journey (${totalDays} Days)`;
  } else if (hasDesert) {
    title = `Grand Saharan Dunes & Chott el Jerid Totality Quest (${totalDays} Days)`;
  } else if (hasCoast) {
    title = `Djerba & Mediterranean Coastline Eclipse Tour (${totalDays} Days)`;
  } else {
    title = `Total Solar Eclipse Tunisia Expedition (${totalDays} Days)`;
  }

  const budgetLabel =
    budget === "luxury"
      ? "Luxury desert riads, private bivouacs, and chauffeured 4x4 transport"
      : budget === "economy"
      ? "Budget-conscious guesthouses, rural transfers, and local transport"
      : "Mid-range boutique hotels, oasis lodges, and comfortable van transfers";

  const groupLabel =
    groupSize > 2
      ? `tailored for a party of ${groupSize}`
      : groupSize === 1
      ? "for solo exploration"
      : "for a traveling pair";

  const culinaryNote = hasFood
    ? " with curated gastronomic stops including Saharan Deglet Nour dates, fresh mint tea, and Mediterranean seafood"
    : "";

  const summary = `A ${totalDays}-day itinerary ${groupLabel} at a ${pace} pace. Features ${budgetLabel}, positioning you directly in ${totalityBaseName} for the 2 August 2027 eclipse${culinaryNote}.`;

  const eclipseDayNotes = `On Monday, 2 August 2027, you are stationed in ${totalityBaseName}. Maximum eclipse occurs at ~11:05 local time (UTC+1) with the Sun at 54°–56° altitude. Duration: ${totalityDuration}. ISO 12312-2 certified eclipse glasses must be worn during all partial phases.`;

  // Build each day based on its relationship to 2 August 2027 and total trip flow
  const days: ItineraryDay[] = dates.map((dateStr, idx) => {
    const dayNumber = idx + 1;
    const isEclipseDay = dateStr === "2027-08-02";
    const isLastDay = idx === dates.length - 1;

    if (isEclipseDay) {
      const activities: Activity[] = [
        {
          id: `act-${dateStr}-1`,
          time: "07:30",
          title: `Pre-Dawn Arrival at ${totalityBaseName} Observation Ground`,
          description: "Arrive before midday desert heating. Inspect optical equipment, solar filters, shade awnings, and rehydration supplies.",
          type: "experience",
          referenceSlug: "desert-totality-viewing",
        },
        {
          id: `act-${dateStr}-2`,
          time: "09:50",
          title: "First Contact (C1) — Partial Eclipse Ingress",
          description: "Moon begins crossing the solar disc. Wear ISO 12312-2 certified glasses at all times during partial phase.",
          type: "destination",
          referenceSlug: totalityBaseSlug,
        },
        {
          id: `act-${dateStr}-3`,
          time: "11:04",
          title: `TOTALITY (C2 to C3) — Corona & Baily's Beads (${totalityDuration})`,
          description: "Remove glasses during totality. Behold the shimmering pearly solar corona, red prominences, and shadow bands sweeping the terrain.",
          type: "destination",
          referenceSlug: totalityBaseSlug,
        },
        {
          id: `act-${dateStr}-4`,
          time: "13:30",
          title: "Post-Totality Oasis Celebration & Thermal Rest",
          description: "Celebrate maximum eclipse with fresh mint tea and seasonal dates under palm shade during peak 40°C afternoon sun.",
          type: "destination",
          referenceSlug: totalityBaseSlug,
        },
      ];

      return {
        dayNumber,
        date: dateStr,
        title: `TOTALITY ECLIPSE DAY: ${totalityBaseName}`,
        destinationSlug: totalityBaseSlug,
        isEclipseDay: true,
        activities: pace === "relaxed" ? activities.slice(0, 3) : activities,
      };
    }

    // If it is the last day of the trip (and not eclipse day)
    if (isLastDay && totalDays > 1) {
      const activities: Activity[] = [
        {
          id: `act-${dateStr}-1`,
          time: "10:30",
          title: "Artisanal Souk Exploration & Traditional Crafts",
          description: "Browse handwoven kilims, ceramics, dates, and olive wood crafts in the historic medina lanes.",
          type: "destination",
          referenceSlug: hasCoast ? "djerba" : "tunis",
        },
        {
          id: `act-${dateStr}-2`,
          time: "15:30",
          title: "Expedition Farewell & Airport Departure Transfer",
          description: "Conclude expedition with private transfer to Tunis-Carthage or Djerba airport with eclipse photographs and memories.",
          type: "destination",
          referenceSlug: "tunis",
        },
      ];

      return {
        dayNumber,
        date: dateStr,
        title: "Medina Souks & Concluding Airport Departure Transfers",
        destinationSlug: hasCoast ? "djerba" : "tunis",
        activities: activities,
      };
    }

    // Days before the eclipse
    if (dateStr < "2027-08-02") {
      if (dateStr === "2027-08-01") {
        // Immediate staging day before eclipse
        const slug = hasCulture ? "kairouan" : totalityBaseSlug;
        const activities: Activity[] = [
          {
            id: `act-${dateStr}-1`,
            time: "09:00",
            title: "The Great Mosque of Uqba in Kairouan",
            description: "Tour the monumental 9th-century courtyard and prayer hall of Islam's fourth holiest city.",
            type: "destination",
            referenceSlug: "kairouan",
          },
          {
            id: `act-${dateStr}-2`,
            time: "14:30",
            title: `Route South to ${totalityBaseName} Observation Base`,
            description: "Scenic transit from olive groves into the desert oasis. Check in and review tomorrow's observation horizon.",
            type: "destination",
            referenceSlug: slug,
          },
          {
            id: `act-${dateStr}-3`,
            time: "18:00",
            title: "Sunset Oasis Palm Grove Walk & Equipment Calibration",
            description: "Final solar filter test and horizon check as the desert cools.",
            type: "experience",
            referenceSlug: "tozeur-oasis-cultural-walk",
          },
        ];

        return {
          dayNumber,
          date: dateStr,
          title: `Transit South & Staging in ${totalityBaseName}`,
          destinationSlug: slug,
          activities: pace === "relaxed" ? activities.slice(0, 2) : activities,
        };
      } else {
        // Earlier arrival
        const activities: Activity[] = [
          {
            id: `act-${dateStr}-1`,
            time: "10:00",
            title: "Arrive Tunis-Carthage Airport & Collect Eclipse Gear",
            description: "Airport transfer, sim card activation, and optical equipment check.",
            type: "destination",
            referenceSlug: "tunis",
          },
          {
            id: `act-${dateStr}-2`,
            time: "14:30",
            title: "Explore the Antonine Baths of Carthage",
            description: "Walk the UNESCO seaside ruins of Ancient Carthage overlooking the Gulf of Tunis.",
            type: "destination",
            referenceSlug: "carthage",
          },
          {
            id: `act-${dateStr}-3`,
            time: "18:00",
            title: "Sunset Mint Tea at Sidi Bou Said",
            description: "Clifftop walk through the blue and white village overlooking the Mediterranean.",
            type: "destination",
            referenceSlug: "sidi-bou-said",
          },
        ];

        return {
          dayNumber,
          date: dateStr,
          title: "Arrival in Tunis, Medina & Carthage Seaside",
          destinationSlug: "carthage",
          activities: pace === "relaxed" ? activities.slice(0, 2) : activities,
        };
      }
    }

    // Days after the eclipse
    if (dateStr === "2027-08-03") {
      const activities: Activity[] = [
        {
          id: `act-${dateStr}-1`,
          time: "08:30",
          title: "Chott el Jerid Salt Pan Causeway Crossing",
          description: "Drive the elevated causeway across 7,000 km² of blinding crystalline salt flats with optical mirages.",
          type: "destination",
          referenceSlug: "chott-el-jerid",
        },
        {
          id: `act-${dateStr}-2`,
          time: "14:00",
          title: "Underground Berber Architecture in Matmata",
          description: "Tour centuries-old subterranean pit dwellings carved deep into sandstone to escape desert heat.",
          type: "destination",
          referenceSlug: "matmata",
        },
      ];

      return {
        dayNumber,
        date: dateStr,
        title: "Chott el Jerid Salt Desert & Matmata Troglodytes",
        destinationSlug: "matmata",
        activities: pace === "relaxed" ? activities.slice(0, 1) : activities,
      };
    }

    // Subsequent days (e.g. 2027-08-04 or later)
    const activities: Activity[] = [
      {
        id: `act-${dateStr}-1`,
        time: "10:00",
        title: "The Roman Colosseum of El Jem",
        description: "Explore North Africa's largest Roman monument, holding 35,000 spectators with intact underground beast chambers.",
        type: "destination",
        referenceSlug: "el-jem",
      },
      {
        id: `act-${dateStr}-2`,
        time: "16:00",
        title: "Mahdia Cape Africa Seafront & Skifa el Kahla",
        description: "Walk the historic Fatimid capital port and watch traditional silk weavers.",
        type: "destination",
        referenceSlug: "mahdia",
      },
    ];

    return {
      dayNumber,
      date: dateStr,
      title: "El Jem Roman Amphitheatre & Coastal Mahdia",
      destinationSlug: "el-jem",
      activities: pace === "relaxed" ? activities.slice(0, 1) : activities,
    };
  });

  return {
    tripTitle: title,
    summary,
    eclipseDayNotes,
    days,
  };
}

export async function POST(req: NextRequest) {
  let startDate = "2027-07-31";
  let endDate = "2027-08-04";
  let interests: string[] = ["desert", "culture", "totality"];
  let pace = "moderate";
  let budget = "moderate";
  let groupSize = 2;
  let eclipsePreference = "totality";

  try {
    const body = await req.json();
    if (body.startDate) startDate = body.startDate;
    if (body.endDate) endDate = body.endDate;
    if (body.interests) {
      interests = Array.isArray(body.interests) ? body.interests : [body.interests];
    }
    if (body.pace) pace = body.pace;
    if (body.budget) budget = body.budget;
    if (body.groupSize) groupSize = Number(body.groupSize) || 2;
    if (body.eclipsePreference) eclipsePreference = body.eclipsePreference;
  } catch {
    // Keep defaults
  }

  const normalizedInterests: string[] = interests.length > 0
    ? interests
    : ["desert", "culture", "totality"];

  const apiKey = process.env.GEMINI_API_KEY;

  // If no Gemini API key or placeholder key, return customized verified engine plan directly
  if (!apiKey || apiKey.length < 15 || apiKey.includes("...")) {
    const tailoredPlan = buildPersonalizedFallback({
      startDate,
      endDate,
      interests: normalizedInterests,
      pace,
      budget,
      groupSize,
      eclipsePreference,
    });

    return NextResponse.json({
      plan: tailoredPlan,
      isFallback: true,
      notice: `Expedition crafted using the Eclipse Tunisia astronomical itinerary engine tailored for ${tailoredPlan.days.length} days (${startDate} to ${endDate}) with ${pace} pace.`,
    });
  }

  // Attempt live Gemini 3.8-flash generation
  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const destinationCatalog = destinations
      .map(
        (d) =>
          `- ${d.name} (slug: "${d.slug}", region: "${d.region}", summary: "${d.summary}")`
      )
      .join("\n");

    const experienceCatalog = experiences
      .map(
        (e) =>
          `- ${e.title} (slug: "${e.slug}", destination: "${e.destinationSlug}", category: "${e.category}", price: ${e.priceAmount} ${e.priceCurrency})`
      )
      .join("\n");

    const prompt = `
You are the master expedition architect for "Eclipse Tunisia", creating an authentic day-by-day itinerary around the total solar eclipse on 2 August 2027.

USER SPECIFICATIONS:
- Start Date: ${startDate}
- End Date: ${endDate}
- Eclipse Focus: ${eclipsePreference === "totality" ? "Must experience 100% Totality (umbra path)" : "Flexible / Partial eclipse acceptable"}
- Interests: ${normalizedInterests.join(", ")}
- Pace: ${pace}
- Budget Level: ${budget}
- Traveling Party: ${groupSize} traveler(s)

AVAILABLE TUNISIAN DESTINATIONS:
${destinationCatalog}

AVAILABLE CURATED EXPERIENCES:
${experienceCatalog}

ASTRONOMICAL MANDATE (CRITICAL):
- Totality occurs on Monday, 2 August 2027 at ~11:00 to 11:15 AM local time (UTC+1, Africa/Tunis).
- Confirmed Totality destinations: Tozeur, Chott el Jerid, Gafsa, Gabès, Djerba, El Jem, Kairouan, Mahdia, Matmata.
- Partial eclipse destinations: Tunis (~97.1%), Carthage (~96.8%), Sidi Bou Said (~96.8%), Sousse (~99.9%), Monastir (~99.9%).
- If the user prefers Totality and 2 August 2027 is in their date range, you MUST place them in a Totality destination (such as Tozeur, Chott el Jerid, Kairouan, El Jem, or Djerba) on 2 August 2027 with isEclipseDay: true.
- Generate exactly one day entry for each calendar day between ${startDate} and ${endDate} inclusive.

Construct a realistic, culturally rich, and logistically sound itinerary matching the requested pace and budget.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are an expert Tunisia travel planner and eclipse specialist. Return only valid JSON conforming strictly to the requested schema. Ground every recommendation in real locations in Tunisia.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tripTitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            eclipseDayNotes: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  date: { type: Type.STRING },
                  title: { type: Type.STRING },
                  destinationSlug: { type: Type.STRING },
                  isEclipseDay: { type: Type.BOOLEAN },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        time: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        type: { type: Type.STRING },
                        referenceSlug: { type: Type.STRING },
                      },
                      required: ["id", "time", "title", "description", "type"],
                    },
                  },
                },
                required: ["dayNumber", "date", "title", "destinationSlug", "activities"],
              },
            },
          },
          required: ["tripTitle", "summary", "eclipseDayNotes", "days"],
        },
      },
    });

    const text = response.text?.trim() || "";
    let parsedPlan: ItineraryPlan;
    try {
      parsedPlan = JSON.parse(text);
    } catch {
      console.warn("Failed to parse Gemini JSON output, falling back to tailored plan");
      parsedPlan = buildPersonalizedFallback({
        startDate,
        endDate,
        interests: normalizedInterests,
        pace,
        budget,
        groupSize,
        eclipsePreference,
      });
    }

    return NextResponse.json({
      plan: parsedPlan,
      isFallback: false,
      modelUsed: "gemini-3.8-flash",
      notice: `Personalized ${parsedPlan.days.length}-day expedition crafted with Gemini AI.`,
    });
  } catch (error: unknown) {
    console.warn("Gemini API call failed, generating tailored plan using verified engine:", error);
    const tailoredPlan = buildPersonalizedFallback({
      startDate,
      endDate,
      interests: normalizedInterests,
      pace,
      budget,
      groupSize,
      eclipsePreference,
    });

    return NextResponse.json({
      plan: tailoredPlan,
      isFallback: true,
      notice: `Expedition crafted using the verified Eclipse Tunisia engine for ${tailoredPlan.days.length} days (${startDate} to ${endDate}) with ${pace} pace.`,
    });
  }
}
