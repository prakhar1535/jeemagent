import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { Langfuse } from "langfuse-node";

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  baseUrl: process.env.LANGFUSE_BASE_URL, // optional, defaults to https://cloud.langfuse.com
});

export function createConversationChain(chatbotId: string) {
  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
  });

  const memory = new BufferMemory();

  const chain = new ConversationChain({
    llm: model,
    memory: memory,
    verbose: true,
  });

  return { chain, langfuse };
}
