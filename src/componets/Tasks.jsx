import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style/Tasks.css"

export default function Tasks() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSend = async () => {
    if (!input.trim()) return

    const newMessage = { sender: "user", text: input }
    setMessages(prev => [...prev, newMessage])
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

      const data = await response.json()
      const aiText = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
        ? data.choices[0].message.content.trim()
        : "Sorry, I couldn’t generate a response right now."
      setMessages(prev => [...prev, { sender: "ai", text: aiText }])
    } catch (error) {
      console.error("AI Error:", error)
      setMessages(prev => [...prev, { sender: "ai", text: "⚠️ Unable to reach the AI right now." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tasks-page">
      {/* Top Navbar with hamburger */}
      <div className="topbar">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="menu"
        >
          &#9776;
        </button>

        {menuOpen && (
          <div className="menu-popup">
            <button onClick={() => { navigate("/home"); setMenuOpen(false) }}>Home</button>
            <button onClick={() => { navigate("/learnmore"); setMenuOpen(false) }}>Learn More</button>
            <button onClick={() => { navigate("/settings"); setMenuOpen(false) }}>Settings</button>
            <button onClick={() => { navigate("/user"); setMenuOpen(false) }}>User</button>
          </div>
        )}
      </div>

      <div className="tasks-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Projects</h2>
          <div className="sidebar-buttons">
            <button className="sidebar-item" onClick={() => navigate("/finished-projects")}>
              ✅ Finished Projects
            </button>
            <button className="sidebar-item" onClick={() => navigate("/current-projects")}>
              🔄 Current Projects
            </button>
            <button className="sidebar-item" onClick={() => navigate("/create-project")}>
              ➕ Create Project
            </button>
            <button className="sidebar-item" onClick={() => navigate("/review-notes")}>
              📝 Review Notes
            </button>
          </div>
        </aside>

        {/* Chat area */}
        <main className="chat-area">
          <div className="chatbox">
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="chat-message ai">
                  Hi! 👋 I can help you plan and organize your projects with chunking.
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}

              {loading && <div className="chat-message ai">Typing...</div>}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Ask about your tasks..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend} disabled={loading}>Send</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
