//Tools
//Identify the stack entry points modules and project structure
import { Octokit } from "@octokit/core";

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
