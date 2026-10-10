import { pathToFileURL } from "node:url";
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import {
  analyze_repository,
  detectTechStack,
  explain_file,
  get_repositroy_map,
  search_code,
} from "./tools.js";

export const server = new McpServer({
  name: "Github-Explorer",
  version: "1.0.0",
});

export function registerJsonTool<T extends z.ZodType>(
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

        const structuredContent =
          typeof result === "object" &&
          result !== null &&
          !Array.isArray(result)
            ? (result as Record<string, unknown>)
            : { value: result };

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
          structuredContent,
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
registerJsonTool(
  "analyze_repository",
  "Analyze the top-level structure of a GitHub repository.",
  z.object({ repo_url: z.string().min(1) }),
  async ({ repo_url }) => analyze_repository(repo_url),
);

registerJsonTool(
  "get_repository_map",
  "Fetch the file tree for a GitHub repository.",
  z.object({ repo_url: z.string().min(1) }),
  async ({ repo_url }) => get_repositroy_map(repo_url),
);

registerJsonTool(
  "detect_tech_stack",
  "Detect likely technologies used by a repository from its file tree.",
  z.object({ repo_url: z.string().min(1) }),
  async ({ repo_url }) => detectTechStack(repo_url),
);

registerJsonTool(
  "explain_file",
  "Summarize the contents of a file from a GitHub repository.",
  z.object({ repo_url: z.string().min(1), file_path: z.string().min(1) }),
  async ({ repo_url, file_path }) => explain_file(repo_url, file_path),
);

registerJsonTool(
  "search_code",
  "Search for code inside a GitHub repository.",
  z.object({ repoUrl: z.string().min(1), query: z.string().min(1), perPage: z.number().int().positive().optional() }),
  async ({ repoUrl, query, perPage }) => search_code({ repoUrl, query, perPage }),
);

export async function main() {
  await server.connect(new StdioServerTransport());
}

const isDirectExecution =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  void main();
}
