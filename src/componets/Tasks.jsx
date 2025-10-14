import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style/Tasks.css"

export default function Tasks() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage = { sender: "user", text: input }
    setMessages([...messages, newMessage])

    // Fake AI reply
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { sender: "ai", text: "Got it — let's work on that." }
      ])
    }, 600)

    setInput("")
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
        {/* Left: Sidebar with project buttons */}
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

        {/* Center: Chatbox */}
        <main className="chat-area">
          <div className="chatbox">
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="chat-message ai">Hi! Ask me about your projects or tasks.</div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Ask about your tasks..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
