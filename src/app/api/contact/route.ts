import { NextRequest, NextResponse } from "next/server";
import type { ContactPayload } from "@/features/contact/interfaces/contact";
import { sendContactEmail, validateContactPayload } from "@/features/contact/services/mailServices";

export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload = await req.json();

    const validationError = validateContactPayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await sendContactEmail(body);

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
