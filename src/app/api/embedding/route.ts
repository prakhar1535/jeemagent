"use server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const chatbotId = request.nextUrl.searchParams.get("chatbotId");

  if (!chatbotId) {
    return NextResponse.json(
      { error: "Missing chatbotId parameter" },
      { status: 400 }
    );
  }

  const embedScript = `
    (function() {
      const script = document.createElement('script');
      script.src = '${process.env.NEXT_PUBLIC_APP_URL}/chatbot.js';
      script.async = true;
      script.onload = function() {
        window.initChatbot('${chatbotId}');
      };
      document.head.appendChild(script);
    })();
  `;

  return new NextResponse(embedScript, {
    headers: { "Content-Type": "application/javascript" },
  });
}
