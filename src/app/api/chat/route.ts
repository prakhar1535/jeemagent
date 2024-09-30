"use server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const chatbotId = request.nextUrl.searchParams.get("chatbotId");
  const { message } = await request.json();

  if (!chatbotId || !message) {
    return NextResponse.json(
      { error: "Missing chatbotId or message" },
      { status: 400 }
    );
  }

  // TODO: Implement actual chatbot logic here
  const reply = `Echo from chatbot ${chatbotId}: ${message}`;

  return NextResponse.json({ reply });
}
