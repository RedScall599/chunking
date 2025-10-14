import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LearnMore() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi there! 👋 I’m your assistant. Want to know more about Chunking?" }
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg = { sender: "user", text: input }
    setMessages(prev => [...prev, userMsg])

    let aiReply = "I'm here to help you learn about Chunking — your productivity companion!"
    if (input.toLowerCase().includes("what")) {
      aiReply = "Chunking helps you break down big goals into small, manageable tasks you can easily track."
    } else if (input.toLowerCase().includes("how")) {
      aiReply = "You can start by creating a task, then divide it into smaller steps — I’ll guide you as you go!"
    } else if (input.toLowerCase().includes("who")) {
      aiReply = "Chunking was built for anyone who struggles with procrastination and wants clear progress."
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "ai", text: aiReply }])
    }, 500)

    setInput("")
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
              {msg.text}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Ask about Chunking..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>

      {/* 👇 Back Button */}
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  )
}
