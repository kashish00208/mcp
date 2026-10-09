import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import {z} from "zod";
const API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0"

const server = new McpServer({
    name:"Weather",
    version:"1.0.0"
})

server.registerTool(
    "get_profile",
    {
        description:"Get github profile data",
        inputSchema : z.object({
            
        })
    }
)