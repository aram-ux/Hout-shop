import { NextResponse } from "next/server";

// Rate limiting: simple in-memory store (resets on redeploy)
const submissions = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max 5 submissions per hour per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = submissions.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  submissions.set(ip, recent);
  return recent.length >= RATE_LIMIT_MAX;
}

function recordSubmission(ip: string) {
  const timestamps = submissions.get(ip) || [];
  timestamps.push(Date.now());
  submissions.set(ip, timestamps);
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
    const { name, email, phone, subject, message } = body;

    // Server-side validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Sanitize inputs (strip HTML tags)
    const sanitize = (str: string) => str.replace(/<[^>]*>/g, "").trim();

    const contactData = {
      name: sanitize(name),
      email: sanitize(email),
      phone: sanitize(phone || ""),
      subject: sanitize(subject),
      message: sanitize(message),
      submittedAt: new Date().toISOString(),
    };

    // ----------------------------------------------------------------
    // EMAIL DELIVERY
    // Option 1: Resend (recommended — set RESEND_API_KEY env variable)
    // Option 2: Any SMTP transporter
    // ----------------------------------------------------------------
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "noreply@hout-shop.com",
          to: process.env.CONTACT_EMAIL || "info@hout-shop.com",
          subject: `[Hout-Shop Contact] ${contactData.subject} — ${contactData.name}`,
          html: `
            <h2>Nieuw contactbericht via hout-shop.com</h2>
            <table style="border-collapse:collapse;width:100%;max-width:600px;">
              <tr><td style="padding:8px;font-weight:bold;">Naam</td><td style="padding:8px;">${contactData.name}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${contactData.email}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Telefoon</td><td style="padding:8px;">${contactData.phone || "-"}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Onderwerp</td><td style="padding:8px;">${contactData.subject}</td></tr>
            </table>
            <h3>Bericht</h3>
            <p style="white-space:pre-wrap;">${contactData.message}</p>
            <hr/>
            <p style="color:#999;font-size:12px;">Verzonden op ${contactData.submittedAt}</p>
          `,
        }),
      });

      if (!res.ok) {
        console.error("Resend API error:", await res.text());
        return NextResponse.json(
          { error: "Failed to send message." },
          { status: 500 }
        );
      }
    } else {
      // Fallback: log to console (so messages aren't lost during development)
      console.log("=== NEW CONTACT FORM SUBMISSION ===");
      console.log(JSON.stringify(contactData, null, 2));
      console.log("===================================");
      console.warn(
        "No RESEND_API_KEY configured. Set it in .env to enable email delivery."
      );
    }

    recordSubmission(ip);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
