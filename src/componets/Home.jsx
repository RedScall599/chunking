import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../style/home.css"
import { auth, signInWithGoogle } from "../lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth"

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
    })
    return () => unsub()
  }, [])

  const handleLogin = async () => {
    try {
      const loggedUser = await signInWithGoogle();
      setUser(loggedUser)
      setMenuOpen(false)
    } catch (err) {
      console.error("Login failed:", err)
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setMenuOpen(false)
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

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
            {user ? (
              <button onClick={handleLogout}>Logout{user.displayName ? ` — ${user.displayName}` : ''}</button>
            ) : (
              <button onClick={handleLogin}>Sign in with Google</button>
            )}
            <button onClick={() => navigate("/settings")}>Settings</button>
            <button onClick={() => navigate("/user")}>User</button>
            <button onClick={() => navigate("/tasks")}>Tasks</button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="home-content">
        <h1>Welcome to Chunking</h1>
        <p>Chunking is a memory and learning strategy where you group individual pieces of information into larger,
             meaningful units (or "chunks") to make them easier to remember and process.
              Instead of trying to memorize many separate items,
             your brain handles a few larger chunks more efficiently.

             To continue please click on the 3 line on the left of your screen.
        </p>
      </div>
    </div>
  )
}
