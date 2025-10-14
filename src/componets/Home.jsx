import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style/Home.css"

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="home">
      {/* Top bar with 3-line button */}
      <div className="navbar">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          &#9776;
        </button>

        {/* Slide-out menu */}
        {menuOpen && (
          <div className="menu-popup">
            <button onClick={() => navigate("/settings")}>Settings</button>
            <button onClick={() => navigate("/user")}>User</button>
            <button onClick={() => navigate("/tasks")}>Tasks</button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="home-content">
        <h1>Welcome to Chunking</h1>
        <p>Manage your time, tasks, and progress efficiently.</p>
      </div>
    </div>
  )
}
