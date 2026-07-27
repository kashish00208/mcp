import pdf from "pdf-parse";
import fs from "fs";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from "dotenv";
import pc from "../chat/pinecone";
import { Request, Response } from "express";

dotenv.config();

const indexname = "open";

interface Embedding {
  values?: number[];
  vector?: number[];
}

interface Vector {
  id: string;
  values: number[];
  metadata: {
    chunk_text: string;
  };
}

export default async function chat(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "File required",
      });
    }

    const buffer = req.file.buffer;

    const data = await pdf(buffer);

    const RAG_DATA = data.text.trim();

    if (!RAG_DATA) {
      return res.status(400).json({
        error: "PDF contains no text",
      });
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.splitText(RAG_DATA);

    const existing = await pc.listIndexes();

    const names = existing.indexes?.map((i) => i.name) ?? [];

    if (!names.includes(indexname)) {
      console.log("Creating Pinecone index...");

      await pc.createIndexForModel({
        name: indexname,
        cloud: "aws",
        region: "us-east-1",
        embed: {
          model: "llama-text-embed-v2",
          fieldMap: {
            text: "chunk_text",
          },
        },
        waitUntilReady: true,
      });
    }

    const index = pc.index(indexname);

    const embeddings = await pc.inference.embed(
      "llama-text-embed-v2",
      chunks,
      {
        inputType: "passage",
        truncate: "END",
      }
    );

    console.log("Chunks count:", chunks.length);
    console.log("First chunk:", chunks[0]?.slice(0, 100));

    const vectors: Vector[] = embeddings.data.map((item, i) => ({
      id: `chunk-${i}`,
      values:
        (item as Embedding).values ??
        (item as Embedding).vector ??
        [],
      metadata: {
        chunk_text: chunks[i],
      },
    }));

    await index.upsert(vectors);

    try {
      const fileContent = await fs.promises.readFile(
        "message.txt",
        "utf8"
      );

      console.log(fileContent);
    } catch (error) {
      console.error("Error reading message.txt", error);
    }

    return res.status(200).json({
      success: true,
      filename: req.file.originalname,
      chunks: chunks.length,
      text: RAG_DATA,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}