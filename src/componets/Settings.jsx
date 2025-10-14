import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style/Settings.css"

export default function Settings() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [audioChoice, setAudioChoice] = useState("audio1")
  const [username, setUsername] = useState("User123")
  const navigate = useNavigate()

  const handleSave = () => {
    alert(`Settings saved!\nDark Mode: ${darkMode ? "On" : "Off"}\nNotifications: ${notifications ? "On" : "Off"}\nAudio: ${audioChoice}`)
  }

  return (
    <div className="settings-page">
      {/* Topbar */}
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
            <button onClick={() => { navigate("/tasks"); setMenuOpen(false) }}>Tasks</button>
            <button onClick={() => { navigate("/learnmore"); setMenuOpen(false) }}>Learn More</button>
            <button onClick={() => { navigate("/user"); setMenuOpen(false) }}>User</button>
          </div>
        )}
      </div>

      {/* Settings Content */}
      <div className="settings-container">
        <h1>⚙️ Settings</h1>

        <div className="settings-box">
          {/* Username */}
          <div className="setting-item">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Dark Mode */}
          <div className="setting-item toggle">
            <label>Dark Mode</label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </div>

          {/* Notifications */}
          <div className="setting-item toggle">
            <label>Notifications</label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
          </div>

          {/* Audio Settings */}
          <div className="setting-item">
            <label>Audio</label>
            <div className="audio-options">
              <label>
                <input
                  type="radio"
                  name="audio"
                  value="audio1"
                  checked={audioChoice === "audio1"}
                  onChange={(e) => setAudioChoice(e.target.value)}
                />
                Audio 1
              </label>

              <label>
                <input
                  type="radio"
                  name="audio"
                  value="audio2"
                  checked={audioChoice === "audio2"}
                  onChange={(e) => setAudioChoice(e.target.value)}
                />
                Audio 2
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
