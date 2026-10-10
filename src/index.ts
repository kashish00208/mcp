import { McpServer } from "@modelcontextprotocol/server";
import { Octokit } from "octokit";
import { z } from "zod";
import { analyze_repository } from "./tools.js";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN!,
});

const server = new McpServer({
  name: "Github-Explorer",
  version: "1.0.0",
});

server.registerTool(
  "analyze_repository",
  {
    title: "Analyze GitHub Repository",
    description:
      "Fetch the root directory structure of a GitHub repository, including file names, paths, and types.",
    inputSchema: z.object({
      repo_url: z.string().url().describe("The URL of a GitHub repository"),
    }),
  },
  async ({ repo_url }) => {
    try {
      const result = await analyze_repository(repo_url);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
        structuredContent: result,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text:
              error instanceof Error
                ? error.message
                : "Repository analysis failed",
          },
        ],
        isError: true,
      };
    }
  },
);
