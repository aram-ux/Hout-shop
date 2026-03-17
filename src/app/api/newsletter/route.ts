import { NextResponse } from "next/server";

// Rate limiting
const subscriptions = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = subscriptions.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  subscriptions.set(ip, recent);
  return recent.length >= RATE_LIMIT_MAX;
}

function recordSubscription(ip: string) {
  const timestamps = subscriptions.get(ip) || [];
  timestamps.push(Date.now());
  subscriptions.set(ip, timestamps);
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.replace(/<[^>]*>/g, "").trim().toLowerCase();

    // Add to Resend audience (contact list)
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      const res = await fetch(
        `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            email: sanitizedEmail,
            unsubscribed: false,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Resend Audience API error:", errorText);
        return NextResponse.json(
          { error: "Subscription failed. Please try again." },
          { status: 500 }
        );
      }
    } else {
      // Fallback: send a notification email
      if (process.env.RESEND_API_KEY) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from:
              process.env.RESEND_FROM_EMAIL || "noreply@hout-shop.com",
            to: process.env.CONTACT_EMAIL || "info@hout-shop.com",
            subject: `[Hout-Shop] Nieuwe nieuwsbrief aanmelding: ${sanitizedEmail}`,
            html: `<p>Nieuw nieuwsbrief abonnement: <strong>${sanitizedEmail}</strong></p><p>Datum: ${new Date().toISOString()}</p>`,
          }),
        });
      } else {
        console.log("[Newsletter] New subscription:", sanitizedEmail);
      }
    }

    recordSubscription(ip);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
