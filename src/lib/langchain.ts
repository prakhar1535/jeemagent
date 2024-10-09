/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "@langchain/core/prompts";
// @ts-ignore
export function createConversationChain(chatbotId: string) {
  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
  });

  const memory = new BufferMemory();

  const promptTemplate = PromptTemplate.fromTemplate(`
    You are a helpful AI assistant. When appropriate, offer recommendations or options to the user.
    If you're providing a list of recommendations or options, start your response with either. 
    Must Strictly follow:
    1) If a user ask for recommendations please ONLY reply with Here are some recommendations:" or "Here are some options:.
    2) If a user ask for a list of recommendations please ONLY reply with Here are some recommendations:" or "Here are some options:.
    3) If a user ask something which you thing may have several options like a, b, c, d or 1, 2, 3, 4 ... reply with Here are some recommendations:" or "Here are some options:.
    4) Please dont add in answer Here are some "sci fi, drama, book" etc recommendations. dont add "sci fi, drama, book" etc anything in between only reply with Here are some recommendations:" or "Here are some options:.
    5) You dont need to give recommendations everytime user messages you please keep in mind not to ruin the user experience and try to think properly weather to give recommendations or not.
    6) You should answer the user queries too weather it involves providing recommendations or not.
    7) If user ask for a normal query that may not include giving recommendations you should not reply with Here are some recommendations:" or "Here are some options: rather reply the user with your own knowledge about that questions
    "Here are some recommendations:" or "Here are some options:" or "Here are some drama movie recommendations based on your preference:".


    Current conversation:
    {history}
    Human: {input}
    AI: `);

  const chain = new ConversationChain({
    llm: model,
    memory: memory,
    prompt: promptTemplate,
    verbose: true,
  });

  return chain;
}
