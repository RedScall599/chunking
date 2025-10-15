import { useState } from "react";
import { useChatCompletion } from "../hooks/useChatCompletion";

export function ChatPanel({ context }) {
  const [messages, setMessages] = useState([]);
  const chatMutation = useChatCompletion();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userMessage = formData.get("prompt")?.trim();
    if (!userMessage) return;

    const nextMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(nextMessages);

    try {
      const result = await chatMutation.mutateAsync({
        messages: nextMessages,
        context,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.reply },
      ]);
    } catch (error) {
      console.error(error);
    }

    event.currentTarget.reset();
  }

  return (
    <section aria-live="polite" className="chat-panel">
      <ul className="chat-messages">
        {messages.map((msg, i) => (
          <li key={i} className={`chat-message chat-message--${msg.role}`}>
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>
            <span>{msg.content}</span>
          </li>
        ))}
        {chatMutation.isPending && (
          <li className="chat-message chat-message--assistant">Typing…</li>
        )}
      </ul>

      <form onSubmit={handleSubmit} className="chat-form">
        <input
          name="prompt"
          type="text"
          placeholder="Ask about your task..."
          aria-label="Ask the assistant"
          required
        />
        <button type="submit" disabled={chatMutation.isPending}>
          Send
        </button>
      </form>

      {chatMutation.isError && (
        <p role="alert" className="chat-error">
          {String(chatMutation.error)}
        </p>
      )}
    </section>
  );
}
