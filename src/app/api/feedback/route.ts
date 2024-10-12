import { NextRequest, NextResponse } from "next/server";
import { Client } from "langsmith";

const client = new Client({
  apiUrl: process.env.LANGCHAIN_ENDPOINT,
  apiKey: process.env.LANGCHAIN_API_KEY,
});

export async function POST(request: NextRequest) {
  const { messageId, isPositive, feedbackText, chatbotId, score } =
    await request.json();

  if (
    !messageId ||
    isPositive === undefined ||
    !chatbotId ||
    score === undefined
  ) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    await client.createFeedback(chatbotId, chatbotId, {
      feedbackId: messageId,
      comment:
        feedbackText ||
        (isPositive ? "Positive feedback" : "Negative feedback"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting feedback" },
      { status: 500 }
    );
  }
}
