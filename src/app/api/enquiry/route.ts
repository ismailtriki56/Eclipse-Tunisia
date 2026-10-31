import { NextResponse } from "next/server";

interface EnquiryBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  packageSlug?: unknown;
  travellers?: unknown;
  message?: unknown;
  locale?: unknown;
  website?: unknown;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: EnquiryBody;

  try {
    body = (await request.json()) as EnquiryBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (text(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = text(body.name, 120);
  const email = text(body.email, 200);
  const phone = text(body.phone, 60);
  const packageSlug = text(body.packageSlug, 80);
  const message = text(body.message, 4000);
  const locale = text(body.locale, 5);
  const travellers = Number(body.travellers);

  if (!name || !email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 422 });
  }

  if (!Number.isFinite(travellers) || travellers < 1 || travellers > 20) {
    return NextResponse.json({ ok: false, error: "invalid_travellers" }, { status: 422 });
  }

  const record = {
    receivedAt: new Date().toISOString(),
    name,
    email,
    phone,
    packageSlug: packageSlug || "unspecified",
    travellers,
    message,
    locale: locale || "en",
  };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL ?? "Eclipse Tunisia <onboarding@resend.dev>";

  if (apiKey && to) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `Eclipse Tunisia enquiry: ${record.packageSlug}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone || "-"}`,
            `Package: ${record.packageSlug}`,
            `Travellers: ${travellers}`,
            `Locale: ${record.locale}`,
            "",
            message || "(no message)",
          ].join("\n"),
        }),
      });

      if (!response.ok) {
        console.error("Resend rejected the enquiry", await response.text());
      }
    } catch (error) {
      console.error("Resend request failed", error);
    }
  } else {
    console.info("Enquiry received (email delivery not configured)", record);
  }

  return NextResponse.json({ ok: true });
}
