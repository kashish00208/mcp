import dotenv from "dotenv";
import cors from "cors";
import express, { Request, Response } from "express";
import Groq from "groq-sdk";
dotenv.config();
const app = express();
app.use(express.json());


app.use(cors({ origin: "http://localhost:3000" }));

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
          content:"No data extracted from PDF, try again later",
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
