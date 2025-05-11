import { useState } from "react";
import axios from "axios";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const aiProviderUrl = import.meta.env.VITE_OPEN_AI_URL;

const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const sendMessage = async (message: string) => {
    await delay(500);
    const newMessages: Message[] = [
      ...messages,
      { text: message, sender: "user" },
    ];
    setMessages(newMessages);

    try {
      const response = await axios.post(
        aiProviderUrl,
        {
          model: "mistral",
          messages: [{ role: "user", content: message }],
          stream: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const botMessage = response.data.message?.content || "No response.";
      setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
    } catch (error) {
      console.error("Error contacting Ollama:", error);
      setMessages([
        ...newMessages,
        { text: "⚠️ AI unavailable", sender: "bot" },
      ]);
    }
  };

  return { messages, sendMessage };
};

export default useChatbot;
