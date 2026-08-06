import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

import { SignUP } from "./routes/signup";
import SignIn from "./routes/signin";
import chat from "./routes/upload";
import { upload } from "./lib/upload";

dotenv.config();

const PORT = 8080;
const app = express();

// Enable CORS for frontend before route declarations
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.post("/auth/signup", SignUP);
app.post("/auth/signin", SignIn);
app.post("/chat", upload.single("file"), chat);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/chat/groq", async (req: Request, res: Response) => {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an analysis bot. You have to provide the following information according to the data provided: 1. Topic 2. Description of the data 3. Overview of the data in 230-400 words 4. Some different resources to learn more about the data",
        },
        {
          role: "user",
          content: req.body.prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const reply = response.choices?.[0]?.message?.content || "";
    res.json({ reply });
  } catch (err) {
    console.error("Error in /paperType route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});