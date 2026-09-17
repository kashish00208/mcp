import { markdown } from "bun";
import express from "express";
import { Firecrawl } from "firecrawl";
const app = express();

 const firecrawl = new Firecrawl({apiKey:process.env.FIRECRAWL_API_KEY!!})
app.use(express.json())

app.post("/perplexity_ask", async (req, res) => {
  const query = req.body.query
  //This is the core learning point how harkirat sees the problem and tackles it
  //Divide all the problem into parts the whole system into parts
  //for perplexity the whole system design in converted into steps
  //Step 1 : Get the query from user
  //Step 2 : make sure user access to hit the endpoint
  //Step 3 : Check if we
  //Step 4 : Web search to gather resources

  const data = await firecrawl.search(query,{
    limit:3,
    scrapeOptions:{formats:['json']}
  })
  //Step 5 : DO some context engineering on the prompt + web search query
  //Step 6 : Also stream back the reponse and follow up question (which we can get through same endpoint)
  //Step 8 : Close the event stream
});

app.listen(3000);
