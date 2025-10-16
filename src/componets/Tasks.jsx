// ===============================
// React imports and styles
// ===============================
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { useNavigate } from "react-router-dom"
import "../style/Tasks.css"

// ===============================
// Main Tasks Component
// - Handles project creation, tracking, and AI chat
// ===============================
export default function Tasks() {

  // ====== State Management ======

  // Stores all chat messages (AI + user)
  const [messages, setMessages] = useState([])

  // Stores user input for chat
  const [input, setInput] = useState("")

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
            <button onClick={() => { navigate("/settings"); setMenuOpen(false) }}>Settings</button>
            <button onClick={() => { navigate("/user"); setMenuOpen(false) }}>User</button>
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
            <button className="sidebar-item">📝 Review Notes</button>
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
    </div>
  )
}
