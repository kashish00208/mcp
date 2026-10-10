import { McpServer } from "@modelcontextprotocol/server";
import { Octokit } from "octokit";
import { z } from "zod";
import { analyze_repository } from "./tools.js";

const octokit = new Octokit({
  auth:process.env.GITHUB_TOKEN!
});

const server = new McpServer({
  name: "Github-Explorer",
  version: "1.0.0",
});

