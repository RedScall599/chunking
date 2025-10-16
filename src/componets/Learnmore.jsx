import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { useNavigate } from "react-router-dom"

import "../style/learnmore.css"



export default function LearnMore() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi there! 👋 I’m your assistant. Want to know more about Chunking?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSend (e) {
  if (!input.trim()) return
  console.log("Sending message:", input)
    const userMsg = { sender: "user", text: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful assistant that explains Chunking clearly." },
            { role: "user", content: input }
          ]
        })
      });

      const data = await response.json();
      const aiText = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
        ? data.choices[0].message.content.trim()
        : "Hmm, I’m not sure how to answer that.";
      const aiMsg = { sender: "ai", text: aiText };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { sender: "ai", text: "⚠️ Error: Unable to reach AI server." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="learnmore-container">
      <div className="about-box">
        <h1>About Chunking</h1>
        <p>
          Chunking is a productivity app designed to help you break large goals into smaller, manageable chunks.
          It helps you stay motivated, visualize progress, and get more done — without feeling overwhelmed.
        </p>
      </div>

      {/* Chat Section */}
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              {msg.sender === "ai"
                ? <ReactMarkdown>{msg.text}</ReactMarkdown>
                : msg.text}
            </div>
          ))}
          {loading && <div className="message ai">Typing...</div>}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Ask about Chunking..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={(e) => handleSend(e)} disabled={loading}>
            Send
          </button>
        </div>
      </div>

      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  )
}
