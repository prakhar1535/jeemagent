import ChatbotWrapper from "../../../components/ChatbotWrapper";

export default function ChatbotPage({
  params,
}: {
  params: { chatbotId: string };
}) {
  return <ChatbotWrapper chatbotId={params.chatbotId} />;
}
