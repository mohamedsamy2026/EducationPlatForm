import chatMessages from "../date/chatMessages";

let mockMessages = [...chatMessages];

export async function getMessages() {
  return [...mockMessages];
}

export async function sendMessage({
  conversationId,
  senderRole,
  type = "text",
  text = "",
}) {
  const newMessage = {
    id: `msg-${Date.now()}`,
    conversationId,
    senderRole,
    type,
    text,
    createdAt: new Date().toLocaleTimeString("ar-EG", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };

  mockMessages.push(newMessage);

  return newMessage;
}