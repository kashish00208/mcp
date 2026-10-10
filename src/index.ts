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

function registerJsonTool<T extends z.ZodType>(
  name: string,
  description: string,
  inputSchema: T,
  handler: (args: z.infer<T>) => Promise<unknown>,
) {
  server.registerTool(
    name,
    {
      title: name,
      description,
      inputSchema,
    },
    async (args) => {
      try {
        const result = await handler(args as z.infer<T>);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
          structuredContent: result as Record<string, unknown>,
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text:
                error instanceof Error
                  ? error.message
                  : "Tool execution failed",
            },
          ],
          isError: true,
        };
      }
    },
  );
}
