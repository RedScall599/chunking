import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChatPanel } from "./ChatPanel";
import "../style/Tasks.css";

export default function Tasks() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="tasks-page">
      {/* Navbar */}
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

      {/* Main Layout */}
      <div className="tasks-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Projects</h2>
          <div className="sidebar-buttons">
            <button onClick={() => navigate("/finished-projects")}>✅ Finished Projects</button>
            <button onClick={() => navigate("/current-projects")}>🔄 Current Projects</button>
            <button onClick={() => navigate("/create-project")}>➕ Create Project</button>
            <button onClick={() => navigate("/review-notes")}>📝 Review Notes</button>
          </div>
        </aside>

        {/* 🧠 ChatPanel replaces old chatbox */}
        <main className="chat-area">
          <ChatPanel />
        </main>
      </div>
    </div>
  );
}
