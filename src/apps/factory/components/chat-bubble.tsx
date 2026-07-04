export type ChatMessageRole = "assistant" | "user";

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  text: string;
};

type ChatBubbleProps = {
  message: ChatMessage;
};

export function ChatBubble({ message }: ChatBubbleProps) {
  return (
    <div className="factory-chat-message" data-role={message.role}>
      <div className="factory-chat-bubble">{message.text}</div>
    </div>
  );
}
