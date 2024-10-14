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
  if the recommendatio is a product that can be bought online or does have a price you can also add 'link' and 'price' in the object.
  Do not include any markdown formatting or code blocks. Just provide the raw JSON array.

  There are some Must Follows:
  1) You should provide a json which contain 'title', 'subtitle', 'link', 'price'.
  2) 'title' and 'subtitle' could be available every time a recommendation is given.
  3) 'link' and 'price' should be available only when the recommendation is a product or does have a price which available online.
  4) only provide valid links to the product dont provide 'example.com' or 'exampleproduct.com' something like this.
  5) Only provide the link and price when there is a specific product not when we are trying to recall group of variants, brands or products for example: a variant in cars is sedan and there can be various models inside it so dont provide link and price for sedan because it may not have a specific link to any product but if you provide a specific car model or brand then provide the link or price, and this is just an example for cars you have to use for every type of product or recommendations you have asked for.
  5) the final structure of the output shuould be like this :
            {
            "title" : title of the recommendation,
            "subtitle" : subtitle of the recommendation,
            "link" : link to the product if available otherwise keep it undefined,
            "price" : price of the product if available otherwise keep it undefined
            }
  
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
