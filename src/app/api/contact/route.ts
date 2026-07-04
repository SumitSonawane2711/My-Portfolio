import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
    name: string;
    email: string;
    message: string;
};

export async function POST(req: NextRequest) {
    try {
        const body: ContactPayload = await req.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Please fill all the fields" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // Fails fast with a clear error if the SMTP credentials are wrong,
        // instead of silently failing on sendMail.
        await transporter.verify();

        await transporter.sendMail({
            from: `"${name}" <${process.env.GMAIL_USER}>`,
            replyTo: email,
            to: process.env.CONTACT_RECEIVER_EMAIL || process.env.GMAIL_USER,
            subject: `New portfolio message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: sans-serif; font-size: 14px; color: #111;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `,
        });

        return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again later." },
            { status: 500 }
        );
    }
}