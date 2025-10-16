import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style/home.css"
import { auth, signInWithGoogle } from "../lib/firebase";

export default function Home() {
  const handleLogin = async () => {
    const loggedUser = await signInWithGoogle();
    setUser(loggedUser);
  };

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
            <button onClick={handleLogin}>Sign in with Google</button>
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
