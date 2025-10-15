import { useNavigate } from "react-router-dom"

export default function Frontpage() {
  const title = "Welcome to Chunking"
  const description = "Break down your tasks into manageable chunks and track your progress with ease!"
  const navigate = useNavigate()

  return (
    <div className="top">
      <div className="title">{title}</div>

      {/* Info Box */}
      <div className="description">
        <p>{description}</p>
      </div>

      {/* Start Button */}
      <button className="button" onClick={() => navigate("/Home")}>
        START
      </button>

      {/* Learn More Button */}
      <button className="button" onClick={() => navigate("/learnmore")}>
        LEARN MORE
      </button>
    </div>
  )
}
