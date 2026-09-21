const chatMessages = [
  {
    id: "msg-1",
    conversationId: "conversation-1",
    senderRole: "teacher",
    type: "text",
    text: "أهلاً بيك 👋 أنا مساعدك الدراسي، لو عندك أي سؤال في المنهج ابعتهولي.",
    createdAt: "10:30 ص",
  },
  {
    id: "msg-2",
    conversationId: "conversation-1",
    senderRole: "student",
    type: "text",
    text: "ممكن تساعدني أفهم الدرس ده؟",
    createdAt: "10:32 ص",
  },
  {
    id: "msg-3",
    conversationId: "conversation-1",
    senderRole: "teacher",
    type: "text",
    text: "طبعًا، ابعتلي الجزء اللي مش واضح ليك وأنا أوضحهولك بطريقة بسيطة.",
    createdAt: "10:33 ص",
  },
  {
    id: "msg-4",
    conversationId: "conversation-1",
    senderRole: "student",
    type: "image",
    text: "صورة مرفقة مع الرسالة",
    createdAt: "10:35 ص",
  },
  {
    id: "msg-5",
    conversationId: "conversation-1",
    senderRole: "student",
    type: "audio",
    duration: "0:42",
    createdAt: "10:38 ص",
  },
];

export default chatMessages;