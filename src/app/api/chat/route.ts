/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextRequest, NextResponse } from "next/server";
import { createConversationChain } from "../../../lib/langchain";
import { LangChainTracer } from "langchain/callbacks";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const tracer = new LangChainTracer();
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

  let chain = conversationChains.get(chatbotId);
  if (!chain) {
    chain = createConversationChain(chatbotId);
    conversationChains.set(chatbotId, chain);
  }

  try {
    const response = await chain.call(
      { input: message },
      { callbacks: [tracer] }
    );

    const shouldShowRecommendations =
      response.response
        .toLowerCase()
        .includes("here are some recommendations") ||
      response.response.toLowerCase().includes("here are some options") ||
      response.response
        .toLowerCase()
        .includes("here are some recommendations based on your preference");

    let recommendations = [];
    if (shouldShowRecommendations) {
      const model = new ChatOpenAI({ temperature: 0.7 });
      const recommendationPrompt = [
        new SystemMessage(
          "You are a helpful AI assistant that provides relevant recommendations based on the conversation context."
        ),
        new HumanMessage(`Based on the following conversation generate a list of 4-6 relevant recommendations or options. 
  Format the output as a JSON array of objects, where each object has a 'title' and a 'subtitle' property. 
  The 'title' should be a short, descriptive name, and the 'subtitle' should provide a brief explanation or context.
  Do not include any markdown formatting or code blocks. Just provide the raw JSON array.
  
  User: ${message}
  AI: ${response.response}
  
  Recommendations:`),
      ];

      const recommendationResponse = await model.call(recommendationPrompt);
      try {
        const cleanedContent = recommendationResponse.content
          // @ts-ignore
          .replace(/```json|```|\n|\r/g, "")
          .replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
        recommendations = JSON.parse(cleanedContent);
        console.log("Parsed recommendations:", recommendations);
        if (
          !Array.isArray(recommendations) ||
          recommendations.some((item) => !item.title || !item.subtitle)
        ) {
          throw new Error("Invalid recommendation format");
        }
      } catch (e) {
        console.error("Error parsing recommendations:", e);
        const lines = recommendationResponse.content
          // @ts-ignore
          .split("\n")
          // @ts-ignore
          .filter((line) => line.trim() !== "");
        recommendations = lines
          .filter(
            // @ts-ignore
            (line) => line.includes('"title"') && line.includes('"subtitle"')
          )
          // @ts-ignore
          .map((line) => {
            const parts = line.split('"');
            return {
              title: parts[3].replace(/,$/, "").trim(),
              subtitle: parts[7].replace(/,$/, "").trim(),
            };
          });
      }
    }

    return NextResponse.json({
      reply: response.response,
      recommendations: shouldShowRecommendations ? recommendations : undefined,
    });
  } catch (error) {
    console.error("Error in chat completion:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
