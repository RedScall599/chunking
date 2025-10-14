import Frontpage from './componets/Frontpage'
import Learnmore from './componets/Learnmore'
import Home from './componets/Home'
import Tasks from './componets/Tasks'
import Settings from './componets/Settings'
import './style/Settings.css'
import './style/Tasks.css'
import './style/Home.css'
import './style/Frontpage.css'
import './style/Learnmore.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path="/learnmore" element={<Learnmore />} />
        <Route path="/home" element={<Home />} />
        <Route path="/homepage" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>
    </Router>
  )
}

