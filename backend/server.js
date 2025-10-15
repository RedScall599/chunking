import express from "express"
import cors from "cors"
import fetch from "node-fetch"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid payload" })
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 400
      })
    })

    const data = await response.json()
    res.json({ reply: data.choices[0]?.message?.content ?? "No response" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"))
