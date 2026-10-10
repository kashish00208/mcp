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
  const match = repo_url.match(
    /github\.com\/([^/]+)\/([^/#?]+)/
  );

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
  const { data: branchData } =
    await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch,
    });

  const treeSha = branchData.commit.commit.tree.sha;

  const { data: treeData } =
    await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: treeSha,
      recursive: "true",
    });

  const paths = treeData.tree
    .map((item) => item.path ?? "")
    .filter(Boolean);

  const has = (filename: string) =>
    paths.some((path) => path === filename);

  const hasAny = (...filenames: string[]) =>
    filenames.some(has);

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
    hasAny("package.json", "vite.config.js",
      "vite.config.ts", "webpack.config.js")
  ) {
    stack.languages.push("JavaScript");
  }

  if (
    hasAny("requirements.txt", "pyproject.toml",
      "Pipfile", "manage.py")
  ) {
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
  if (
    hasAny("next.config.js", "next.config.mjs",
      "next.config.ts")
  ) {
    stack.frontend.push("Next.js");
  }

  if (hasAny("vite.config.js", "vite.config.ts")) {
    stack.frontend.push("Vite");
  }

  if (hasAny("angular.json")) {
    stack.frontend.push("Angular");
  }

  if (hasAny("vue.config.js", "nuxt.config.ts",
      "nuxt.config.js")) {
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

  if (hasAny("Dockerfile", "docker-compose.yml",
      "compose.yaml", "compose.yml")) {
    stack.tools.push("Docker");
  }

  if (hasAny(".github/workflows")) {
    stack.tools.push("GitHub Actions (possible)");
  }

  if (hasAny("prisma/schema.prisma")) {
    stack.database.push("Prisma ORM");
  }

  if (hasAny("drizzle.config.ts",
      "drizzle.config.js")) {
    stack.database.push("Drizzle ORM");
  }

  return {
    repository: `${owner}/${repo}`,
    defaultBranch: branch,
    stack,
    truncated: treeData.truncated,
    note:
      "Detections are based on file paths; inspect dependency manifests to confirm.",
  };
}