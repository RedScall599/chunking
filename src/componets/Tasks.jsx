// ===============================
// React imports and styles
// ===============================
import { useEffect } from "react"

import { useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { useNavigate } from "react-router-dom"
import "../style/tasks.css"

// ===============================
// Main Tasks Component
// - Handles project creation, tracking, and AI chat
// ===============================
export default function Tasks() {

  // ====== State Management ======

  // ============ TIMER STATE ============
const [timeLeft, setTimeLeft] = useState(0)          // seconds remaining
const [running, setRunning] = useState(false)
const [customMinutes, setCustomMinutes] = useState(0)
const [customSeconds, setCustomSeconds] = useState(0)

// Convert seconds → MM:SS format
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

// Set total time based on inputs
const handleSetTime = () => {
  const totalSeconds = (parseInt(customMinutes || 0) * 60) + parseInt(customSeconds || 0)
  if (totalSeconds > 0) {
    setTimeLeft(totalSeconds)
    setRunning(false)
  }
}

// Countdown effect
// Create and preload audio once (using the file in /public)
const audioRef = useRef(null)
useEffect(() => {
  try {
    audioRef.current = new Audio("/mixkit-classic-alarm-995.wav")
    audioRef.current.preload = "auto"
    audioRef.current.crossOrigin = "anonymous"
  } catch (err) {
    console.warn("Failed to initialize audio:", err)
  }

  let timer
  if (running && timeLeft > 0) {
    timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
  } else if (timeLeft === 0 && running) {
    setRunning(false)
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.warn("Audio play failed:", err))
    } else {
      console.warn("No audio available to play")
    }
  }
  return () => clearInterval(timer)
}, [running, timeLeft])


  // Stores all chat messages (AI + user)
  const [messages, setMessages] = useState([])

  // Stores user input for chat
  const [input, setInput] = useState("")

  // === Notes state ===
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState([])
  const [noteText, setNoteText] = useState("")
  const [editingId, setEditingId] = useState(null)

  // Load saved notes from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("chunking_notes")
      if (raw) setNotes(JSON.parse(raw))
    } catch (err) {
      console.warn("Failed to load notes:", err)
    }
  }, [])

  const handleSaveNote = () => {
    const text = (noteText || "").trim()
    if (!text) return
    let updated
    if (editingId) {
      // update existing note
      updated = notes.map(n => n.id === editingId ? { ...n, text } : n)
    } else {
      const newNote = { id: Date.now(), text }
      updated = [...notes, newNote]
    }
    setNotes(updated)
    try { localStorage.setItem("chunking_notes", JSON.stringify(updated)) } catch (err) { console.warn("Failed to save note:", err) }
    setNoteText("")
    setEditingId(null)
  }

  const handleDeleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    try { localStorage.setItem("chunking_notes", JSON.stringify(updated)) } catch (err) { console.warn("Failed to delete note:", err) }
  }

  const handleEditNote = (id) => {
    const found = notes.find(n => n.id === id)
    if (!found) return
    setNoteText(found.text)
    setEditingId(id)
    setShowNotes(true)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setNoteText("")
  }

  // Controls whether the hamburger menu is open
  const [menuOpen, setMenuOpen] = useState(false)

  // Controls the "Typing..." loading state for chat
  const [loading, setLoading] = useState(false)

  // Stores ongoing (unfinished) projects
  const [projects, setProjects] = useState([])

  // Stores finished (completed) projects
  const [finishedProjects, setFinishedProjects] = useState([])

  // Toggles display of the "Create Project" checklist form
  const [showForm, setShowForm] = useState(false)

  // Holds the current project whose goals are being viewed in a popup
  const [goalPopup, setGoalPopup] = useState(null) // { name, goals } or null

  // React Router navigation function
  const navigate = useNavigate()


  // ===============================
  // 🔹 handleSend()
  // Sends a message to the AI and updates the chat view
  // ===============================
  const handleSend = async () => {
    if (!input.trim()) return // Prevent sending empty messages

    const newMessage = { sender: "user", text: input }

    // Add user message to message list
    setMessages(prev => [...prev, newMessage])
    setInput("") // Clear input
    setLoading(true) // Show "Typing..." indicator

    try {
      // Make request to OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that explains Chunking clearly. Summarize in 5 to 6 bullet points."
            },
            { role: "user", content: input }
          ]
        })
      })

      // Parse AI response
      const data = await response.json()
      const aiText =
        data.choices?.[0]?.message?.content?.trim() ||
        "Sorry, I couldn’t generate a response right now."

      // Add AI reply to chat
      setMessages(prev => [...prev, { sender: "ai", text: aiText }])
    } catch (error) {
      // Handle API/network errors
      console.error("AI Error:", error)
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "⚠️ Unable to reach the AI right now." }
      ])
    } finally {
      // Hide typing indicator
      setLoading(false)
    }
  }


  // ===============================
  // 🔹 handleCreateProject()
  // Creates a new project and adds it to the "Current Projects" list
  // ===============================
  const handleCreateProject = (e) => {
    e.preventDefault() // Prevent page reload
    const form = e.target

    // Build project object from form inputs
    const newProject = {
      name: form.projectName.value,
      goals: form.goals.value,
      tasks: [
        { name: "Research", done: form.research.checked },
        { name: "Planning", done: form.planning.checked },
        { name: "Execution", done: form.execution.checked },
      ],
    }

    // Add to active project list
    setProjects(prev => [...prev, newProject])
    setShowForm(false) // Hide the creation form
    form.reset() // Clear input fields
  }


  // ===============================
  // 🔹 toggleTask()
  // Toggles a task checkbox and moves the project between lists when completed
  // ===============================
  const toggleTask = (projectIndex, taskIndex, finished = false) => {
  if (finished) {
    // 🧱 Toggling inside FINISHED projects
    setFinishedProjects(prev => {
      const updated = prev.map((proj, i) => {
        if (i !== projectIndex) return proj
        const updatedTasks = proj.tasks.map((task, j) =>
          j === taskIndex ? { ...task, done: !task.done } : task
        )
        return { ...proj, tasks: updatedTasks }
      })

      // Find the updated project
      const targetProj = updated[projectIndex]

      // If any task becomes unchecked → move back to CURRENT
      if (targetProj.tasks.some(t => !t.done)) {
        setProjects(prev => {
          // Prevent accidental duplication
          if (prev.some(p => p.name === targetProj.name)) return prev
          return [...prev, targetProj]
        })
        // Remove it from finished
        return updated.filter((_, i) => i !== projectIndex)
      }

      return updated
    })
  } else {
    // 🧱 Toggling inside CURRENT projects
    setProjects(prev => {
      const updated = prev.map((proj, i) => {
        if (i !== projectIndex) return proj
        const updatedTasks = proj.tasks.map((task, j) =>
          j === taskIndex ? { ...task, done: !task.done } : task
        )
        return { ...proj, tasks: updatedTasks }
      })

      const targetProj = updated[projectIndex]

      // If ALL tasks done → move to FINISHED
      if (targetProj.tasks.every(t => t.done)) {
        setFinishedProjects(prev => {
          // Prevent accidental duplication
          if (prev.some(p => p.name === targetProj.name)) return prev
          return [...prev, targetProj]
        })
        // Remove it from current
        return updated.filter((_, i) => i !== projectIndex)
      }

      return updated
    })
  }
}



  // ===============================
  // 🧠 Component Render
  // ===============================
  return (
    <div className="tasks-page">

      {/* === Navigation Bar === */}
      <div className="topbar">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="menu"
        >
          &#9776;
        </button>

        {/* Popup menu for navigation */}
        {menuOpen && (
          <div className="menu-popup">
            <button onClick={() => { navigate("/home"); setMenuOpen(false) }}>Home</button>
            <button onClick={() => { navigate("/learnmore"); setMenuOpen(false) }}>Learn More</button>
            {/* <button onClick={() => { navigate("/settings"); setMenuOpen(false) }}>Settings</button> */}
          </div>
        )}
      </div>

      {/* === Main Layout === */}
      <div className="tasks-layout">

        {/* ===== Sidebar (Projects section) ===== */}
        <aside className="sidebar">
          <h2>Projects</h2>

          {/* Buttons for actions */}
          <div className="sidebar-buttons">
            <button className="sidebar-item" onClick={() => setShowForm(!showForm)}>
              ➕ Create Project
            </button>
            <button className="sidebar-item" onClick={() => { setShowNotes(true); setMenuOpen(false); }}>
              📝 Review Notes
            </button>
          </div>

          {/* === Current Projects List === */}
          <div className="current-projects">
            <h3>Current Projects</h3>

            {/* Show placeholder if no projects */}
            {projects.length === 0 ? (
              <p>No current projects. Create one!</p>
            ) : (
              projects.map((p, i) => (
                <div key={i} className="project-item">
                  <h4>{p.name}</h4>
                  <button className="goal-btn" onClick={() => setGoalPopup(p)}>
                    View Goals
                  </button>

                  {/* Display checklist */}
                  <ul>
                    {p.tasks.map((t, j) => (
                      <li key={j}>
                        <label>
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={() => toggleTask(i, j, false)}
                          />{" "}
                          {t.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>

          {/* === Finished Projects List === */}
          <div className="finished-projects">
            <h3>Finished Projects</h3>
            {finishedProjects.length === 0 ? (
              <p>No finished projects yet.</p>
            ) : (
              finishedProjects.map((p, i) => (
                <div key={i} className="project-item finished">
                  <h4>{p.name}</h4>
                  <button className="goal-btn" onClick={() => setGoalPopup(p)}>
                    View Goals
                  </button>
                  <ul>
                    {p.tasks.map((t, j) => (
                      <li key={j}>
                        <label>
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={() => toggleTask(i, j, true)}
                          />{" "}
                          {t.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </aside>


        {/* ===== Create Project Form ===== */}
        {showForm && (
          <div className="checklist-form">
            <h3>Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <label>
                Project Name:
                <input type="text" name="projectName" required />
              </label>

              <label>
                Goals:
                <textarea
                  className="form-textarea"
                  name="goals"
                  placeholder="Describe the main goals..."
                />
              </label>

              <h4>Checklist</h4>
              <label><input type="checkbox" name="research" /> Research</label><br />
              <label><input type="checkbox" name="planning" /> Planning</label><br />
              <label><input type="checkbox" name="execution" /> Execution</label><br />

              <button type="submit" className="save-project-btn">Save Project</button>
            </form>
          </div>
        )}
        {/* ============ TIMER SECTION ============ */}
        <div className="timer-section">
          <h3>⏰ Focus Timer</h3>

          <div className="timer-display">{formatTime(timeLeft)}</div>

          <div className="timer-inputs">
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="Sec"
              value={customSeconds}
              onChange={(e) => setCustomSeconds(e.target.value)}
            />
          </div>

          <div className="timer-controls">
            <button onClick={handleSetTime}>Set</button>
            <button
              onClick={async () => {
                // Try to unlock audio on first user gesture by playing muted then pausing
                if (audioRef.current) {
                  try {
                    audioRef.current.muted = true
                    await audioRef.current.play()
                    audioRef.current.pause()
                    audioRef.current.currentTime = 0
                    audioRef.current.muted = false
                  } catch (err) {
                    console.warn("Audio unlock attempt failed:", err)
                  }
                }
                setRunning(true)
              }}
              disabled={timeLeft === 0}
            >
              Start
            </button>
            <button onClick={() => setRunning(false)}>Pause</button>
            <button onClick={() => { setRunning(false); setTimeLeft(0); }}>Reset</button>
          </div>
        </div>



        {/* ===== Chat Section ===== */}
        <main className="chat-area">
          <div className="chatbox">

            {/* === Chat Messages === */}
            <div className="chat-messages">
              {/* Default welcome message */}
              {messages.length === 0 && (
                <div className="chat-message ai">
                  Hi! 👋 I can help you plan and organize your projects with chunking.
                </div>
              )}

              {/* Render each message */}
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.sender}`}>
                  {msg.sender === "ai"
                    ? <ReactMarkdown>{msg.text}</ReactMarkdown>
                    : msg.text}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && <div className="chat-message ai">Typing...</div>}
            </div>

            {/* === Input box for chat === */}
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

      {/* ===== Goals Popup Overlay ===== */}
      {goalPopup && (
        <div className="goal-popup-overlay" onClick={() => setGoalPopup(null)}>
          <div className="goal-popup" onClick={(e) => e.stopPropagation()}>
            <h3>{goalPopup.name}</h3>
            <p className="goal-text">{goalPopup.goals || "No goals set."}</p>
            <button onClick={() => setGoalPopup(null)}>Close</button>
          </div>
        </div>
      )}

      {/* ===== Notes Modal (popup) ===== */}
      {showNotes && (
        <div
          className="goal-popup-overlay"
          style={{ zIndex: 1200 }}
          onClick={() => { setShowNotes(false); setEditingId(null); setNoteText("") }}
        >
          <div
            className="goal-popup"
            style={{ maxWidth: 700, width: '95%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Review Notes</h3>

            <div style={{ maxHeight: '40vh', overflowY: 'auto', marginBottom: 12 }}>
              {notes.length === 0 ? (
                <p>No notes yet. Add one below.</p>
              ) : (
                notes.map(n => (
                  <div key={n.id} style={{ border: '1px solid #ff4444', padding: 10, borderRadius: 8, marginBottom: 8 }}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{n.text}</div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button className="goal-btn" onClick={() => handleEditNote(n.id)}>Edit</button>
                      <button className="goal-btn" onClick={() => handleDeleteNote(n.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <label className="form-label">{editingId ? 'Edit Note' : 'New Note'}</label>
            <textarea
              className="form-textarea"
              placeholder="Type your note here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />

            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
              {editingId ? (
                <>
                  <button className="save-project-btn" onClick={handleSaveNote}>Save</button>
                  <button className="goal-btn" onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="save-project-btn" onClick={handleSaveNote}>Save</button>
                  <button className="goal-btn" onClick={() => { setShowNotes(false); setNoteText("") }}>Close</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
