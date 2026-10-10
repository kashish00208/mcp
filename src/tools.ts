//Tools
//Identify the stack entry points modules and project structure
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function analyze_repository(repo_url: string) {
  const match = repo_url.match(/github\.com\/([^/]+)\/([^/#?]+)/);

  if (!match) {
    throw new Error("Invalid Github repository URL");
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, "");

  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner,
      repo,
      path: "",
      headers: {
        "X-Github-Api-Version": "2026-03-10",
      },
    },
  );

  const files = response.data;

  if (!Array.isArray(files)) {
    throw new Error("Expected repository directory contents");
  }

  const project_structure = files.map((file) => ({
    name: file.name,
    path: file.path,
    type: file.type,
  }));

  return {
    owner,
    repo,
    project_structure,
  };
}

//Return a summarized directory tree
async function get_repositroy_map(repo_url: string) {
  const match = repo_url.match(/github\.com\/([^/]+)\/([^/#?]+)/);

  if (!match) {
    throw new Error("Invalid Github repository URL");
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, "");

  const { data: repository } = await octokit.request(
    "GET /repos/{owner}/{repo}",
    { owner, repo },
  );

  const branch = repository.default_branch;

  const { data: branchData } = await octokit.request(
    "GET /repos/{owner}/{repo}/branches/{branch}",
    { owner, repo, branch },
  );

  const treeSha = branchData.commit.commit.tree.sha;

  const { data: treeData } = await octokit.request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
    {
      owner,
      repo,
      tree_sha: treeSha,
      recursive: "true",
    },
  );

  return {
    owner,
    repo,
    branch,
    files: treeData.tree.map((item) => ({
      path: item.path,
      type: item.type,
      sha: item.sha,
      size: item.size,
    })),
    truncated: treeData.truncated,
  };
}

export async function detectTechStack(repo_url: string) {
  const match = repo_url.match(/github\.com\/([^/]+)\/([^/#?]+)/);

  if (!match) {
    throw new Error("Invalid GitHub repository URL");
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, "");

  // Get repository's default branch
  const { data: repository } = await octokit.rest.repos.get({
    owner,
    repo,
  });

  const branch = repository.default_branch;

  // Get repository file tree
  const { data: branchData } = await octokit.rest.repos.getBranch({
    owner,
    repo,
    branch,
  });

  const treeSha = branchData.commit.commit.tree.sha;

  const { data: treeData } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: treeSha,
    recursive: "true",
  });

  const paths = treeData.tree.map((item) => item.path ?? "").filter(Boolean);

  const has = (filename: string) => paths.some((path) => path === filename);

  const hasAny = (...filenames: string[]) => filenames.some(has);

  const stack = {
    languages: [] as string[],
    frontend: [] as string[],
    backend: [] as string[],
    database: [] as string[],
    tools: [] as string[],
  };

  // Languages: filename-based clues
  if (hasAny("tsconfig.json")) {
    stack.languages.push("TypeScript");
  }

  if (
    hasAny(
      "package.json",
      "vite.config.js",
      "vite.config.ts",
      "webpack.config.js",
    )
  ) {
    stack.languages.push("JavaScript");
  }

  if (hasAny("requirements.txt", "pyproject.toml", "Pipfile", "manage.py")) {
    stack.languages.push("Python");
  }

  if (hasAny("Gemfile", "config/application.rb")) {
    stack.languages.push("Ruby");
  }

  if (hasAny("go.mod")) {
    stack.languages.push("Go");
  }

  if (hasAny("Cargo.toml")) {
    stack.languages.push("Rust");
  }

  // Frontend frameworks
  if (hasAny("next.config.js", "next.config.mjs", "next.config.ts")) {
    stack.frontend.push("Next.js");
  }

  if (hasAny("vite.config.js", "vite.config.ts")) {
    stack.frontend.push("Vite");
  }

  if (hasAny("angular.json")) {
    stack.frontend.push("Angular");
  }

  if (hasAny("vue.config.js", "nuxt.config.ts", "nuxt.config.js")) {
    stack.frontend.push("Vue / Nuxt");
  }

  // Backend frameworks
  if (hasAny("manage.py")) {
    stack.backend.push("Django (likely)");
  }

  if (hasAny("Gemfile", "config/routes.rb")) {
    stack.backend.push("Ruby on Rails (possible)");
  }

  if (hasAny("nest-cli.json")) {
    stack.backend.push("NestJS");
  }

  if (
    hasAny("Dockerfile", "docker-compose.yml", "compose.yaml", "compose.yml")
  ) {
    stack.tools.push("Docker");
  }

  if (hasAny(".github/workflows")) {
    stack.tools.push("GitHub Actions (possible)");
  }

  if (hasAny("prisma/schema.prisma")) {
    stack.database.push("Prisma ORM");
  }

  if (hasAny("drizzle.config.ts", "drizzle.config.js")) {
    stack.database.push("Drizzle ORM");
  }

  return {
    repository: `${owner}/${repo}`,
    defaultBranch: branch,
    stack,
    truncated: treeData.truncated,
    note: "Detections are based on file paths; inspect dependency manifests to confirm.",
  };
}

function parseGithubRepoUrl(repo_url: string) {
  const match =
    repo_url.match(/github\.com[/:]([^/]+)\/([^/#?]+)/i) ??
    repo_url.match(/git@github\.com:([^/]+)\/([^/#?]+)/i);

  if (!match) {
    throw new Error("Invalid GitHub repository URL");
  }

  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ""),
  };
}

function detectLanguage(file_path: string) {
  const name = file_path.toLowerCase();

  if (name.endsWith(".ts") || name.endsWith(".tsx")) return "TypeScript";
  if (name.endsWith(".js") || name.endsWith(".jsx")) return "JavaScript";
  if (name.endsWith(".py")) return "Python";
  if (name.endsWith(".go")) return "Go";
  if (name.endsWith(".rs")) return "Rust";
  if (name.endsWith(".java")) return "Java";
  if (name.endsWith(".json")) return "JSON";
  if (name.endsWith(".md")) return "Markdown";
  if (name.endsWith(".yml") || name.endsWith(".yaml")) return "YAML";
  if (name.endsWith(".sql")) return "SQL";

  return "Text";
}

function extractSymbolNames(content: string) {
  const patterns = [
    /export\s+(?:default\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)/g,
    /export\s+(?:default\s+)?class\s+([A-Za-z0-9_]+)/g,
    /export\s+(?:const|let|var|interface|type)\s+([A-Za-z0-9_]+)/g,
    /class\s+([A-Za-z0-9_]+)/g,
    /function\s+([A-Za-z0-9_]+)/g,
    /const\s+([A-Za-z0-9_]+)\s*=\s*/g,
  ];

  const symbols = new Set<string>();

  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      const symbol = match[1];
      if (symbol) {
        symbols.add(symbol);
      }
    }
  }

  return [...symbols].slice(0, 8);
}

function explainContent(
  file_path: string,
  content: string,
  stack: Record<string, string[]>,
) {
  const normalizedPath = file_path.replace(/^\/+/, "");
  const language = detectLanguage(normalizedPath);
  const symbols = extractSymbolNames(content);
  const repoStack = Object.values(stack).flat().slice(0, 6).join(", ");

  const lowerPath = normalizedPath.toLowerCase();

  let summary =
    "This file appears to contain project logic and configuration related to the application's implementation.";

  if (normalizedPath.includes("package.json")) {
    summary =
      "This file defines the project's dependencies, scripts, and package metadata.";
  } else if (
    normalizedPath.includes("README") ||
    normalizedPath.endsWith(".md")
  ) {
    summary =
      "This documentation file explains how to run, install, and use the project.";
  } else if (
    normalizedPath.includes("config") ||
    normalizedPath.includes("settings") ||
    normalizedPath.endsWith(".json")
  ) {
    summary =
      "This configuration file defines runtime settings, environment values, or project metadata.";
  } else if (
    normalizedPath.includes("route") ||
    normalizedPath.includes("controller") ||
    normalizedPath.includes("api")
  ) {
    summary =
      "This file likely contains API routes, request handling, or server-side logic for the application.";
  } else if (
    normalizedPath.includes("model") ||
    normalizedPath.includes("schema") ||
    normalizedPath.includes("db")
  ) {
    summary =
      "This file likely defines data models, schema rules, or persistence logic.";
  } else if (
    normalizedPath.includes("test") ||
    normalizedPath.includes("spec")
  ) {
    summary =
      "This file is likely focused on validating the behavior of the application or a component.";
  } else if (
    lowerPath.includes("src") &&
    (content.includes("export") ||
      content.includes("class ") ||
      content.includes("function "))
  ) {
    summary =
      "This source file implements application behavior and exports code that other parts of the project consume.";
  }

  if (symbols.length > 0) {
    summary += ` It exposes ${symbols.slice(0, 3).join(", ")}${symbols.length > 3 ? ", and more" : ""}.`;
  }

  if (repoStack) {
    summary += ` The repository appears to use ${repoStack}.`;
  }

  return {
    path: normalizedPath,
    language,
    summary,
    keySymbols: symbols,
    stack: repoStack,
  };
}

export async function explain_file(repo_url: string, file_path: string) {
  const { owner, repo } = parseGithubRepoUrl(repo_url);
  const normalizedPath = file_path.replace(/^\/+/, "");

  const stack = await detectTechStack(repo_url);

  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: normalizedPath,
  });

  if (Array.isArray(data) || data.type !== "file") {
    throw new Error(
      "The provided path does not point to a file in the repository.",
    );
  }

  const content =
    typeof data.content === "string" && data.content
      ? Buffer.from(
          data.content,
          data.encoding === "base64" ? "base64" : "utf8",
        ).toString("utf8")
      : "";

  const explanation = explainContent(normalizedPath, content, stack.stack);

  return {
    repository: `${owner}/${repo}`,
    defaultBranch: stack.defaultBranch,
    ...explanation,
  };
}

type CodeSearchOptions = {
  repoUrl: string;
  query: string;
  perPage?: number;
};

export async function search_code({
  repoUrl,
  query,
  perPage = 10,
}: CodeSearchOptions) {
  const { owner, repo } = parseGithubRepoUrl(repoUrl);

  if (!query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  const { data } = await octokit.rest.search.code({
    q: `${query.trim()} repo:${owner}/${repo}`,
    per_page: Math.min(Math.max(perPage, 1), 100),
  });

  return {
    repository: `${owner}/${repo}`,
    query,
    totalCount: data.total_count,
    incompleteResults: data.incomplete_results,
    results: data.items.map((item) => ({
      path: item.path,
      name: item.name,
      url: item.html_url,
      sha: item.sha,
      repository: item.repository.full_name,
      snippet: item.text_matches?.map(
        (match) => match.fragment
      ) ?? [],
    })),
  };
}

