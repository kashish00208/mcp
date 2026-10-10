//Tools
//Identify the stack entry points modules and project structure
import { Octokit } from "@octokit/core";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function analyze_repository(repo_url: string) {
    const match = repo_url.match(/github\.com\/([^/]+)\/([^/#?]+)/);

    if(!match){
        throw new Error("Invalid Github repository URL");
    }

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, "");

    const response = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}"
        {
            owner,
            repo,
            path:"",
            headers:{
                "X-Github-Api-Version":"2026-03-10"
            }
        }
    )

    const files = response.data;

    if(!Array.isArray(files)){
        throw new Error("Expected repository directory contents");
    }

    const project_structure = files.map((file)=>({
        name:file.name,
        path:file.path,
        type:file.type
    }));

    return {
        owner,
        repo,
        project_structure
    }
}
