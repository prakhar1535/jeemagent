import { NextRequest, NextResponse } from "next/server";
import { createConversationChain } from "../../../lib/langchain";

const conversationChains = new Map();

export async function POST(request: NextRequest) {
  const chatbotId = request.nextUrl.searchParams.get("chatbotId");
  const { message } = await request.json();

  if (!chatbotId || !message) {
    return NextResponse.json(
      { error: "Missing chatbotId or message" },
      { status: 400 }
    );
  }

  let chainData = conversationChains.get(chatbotId);
  if (!chainData) {
    chainData = createConversationChain(chatbotId);
    conversationChains.set(chatbotId, chainData);
  }

  const { chain, langfuse } = chainData;

  const trace = langfuse.trace({
    id: `chat-${chatbotId}-${Date.now()}`,
    metadata: { chatbotId },
    input: { message }, // Add the input message to the trace
  });

  try {
    const span = trace.span({
      name: "generate_ai_response",
      input: { message },
    });

    const response = await chain.call({ input: message });

    span.end({
      output: { response: response.response },
    });

    trace.update({
      output: { response: response.response }, // Add the output to the trace
    });

    trace.score({
      name: "response_length",
      value: response.response.length,
    });

    trace.event({
      name: "chat_completion",
      level: "info",
      metadata: { status: "success" },
    });

    return NextResponse.json({ reply: response.response });
  } catch (error) {
    console.error("Error in chat completion:", error);
    trace.event({
      name: "error",
      level: "error",
      metadata: { error: error.message },
    });

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
