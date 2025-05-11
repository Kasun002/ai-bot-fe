import * as React from "react";
import { LuSendHorizontal } from "react-icons/lu";
import { MdSupportAgent } from "react-icons/md";
import Markdown from "react-markdown";
import useChatbot from "../hooks/useChatbot";
import useChatScroll from "../hooks/useChatScroll";

const ChatComponent: React.FunctionComponent = () => {
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { messages, sendMessage: rawSendMessage } = useChatbot();

  const ref = useChatScroll(messages);

  const sendMessage = async (msg: string) => {
    setLoading(true);
    await rawSendMessage(msg);
    setLoading(false);
  };

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white">
      <h2 className="p-4 font-semibold text-lg text-center bg-green-100 flex text-green-800 justify-center items-center gap-2">
        Talking Friend <MdSupportAgent size={25} />
      </h2>

      <div ref={ref} className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs ${msg.sender === "user"
              ? "bg-green-500 text-white ml-auto"
              : "bg-gray-300 text-gray-800"
              }`}
          >
            <Markdown
              components={{
                code({ className, children, ...props }) {
                  return (
                    <code className={`text-sm px-1 py-0.5 rounded ${className || ""}`} {...props}>
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <pre className="bg-gray-800 text-white p-2 rounded overflow-x-auto">{children}</pre>;
                },
              }}
            >
              {msg.text}
            </Markdown>
          </div>
        ))}

        {loading && (
          <div className="p-3 rounded-lg max-w-xs bg-gray-200 text-gray-400 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        )}
      </div>

      <div className="flex items-center p-4 bg-gray-50">
        <input
          type="text"
          className=  {`flex-1 p-2 border rounded-lg focus:outline-none $ ${loading? 'opacity-60': 'opacity-100'}`}
          placeholder="How can I help you"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} className={`p-2 ${loading? 'opacity-60': 'opacity-100'}`} disabled={loading}>
          <LuSendHorizontal size={25} />
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
