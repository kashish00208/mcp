const USER_AGENT = "weather-app/1.0"
export interface AlertFeature {
  properties: {
    event?: string;
    areaDesc?: string;
    severity?: string;
    status?: string;
    headline?: string;
  };
}

interface display {
    name?:string;
    repositories?:number;
    raisedPRs:number;
    totalRaisedIssues?:number
}

async function makeGithubRequest<T>(url: string): Promise<T | null> {
    const headers = {
        "USer-Agent":USER_AGENT,
        Accept:"application/geo+json",
    };
    
    try{
        const response = await fetch (url,{headers});
        if(!response.ok){
            throw new Error(`HTTP error! status : ${response.status}`)
        }
        return (await response.json()) as T;
    }catch(err){
        console.error("Error making NWS request :",err)
        return null
    }
}

function formatAlert(feature:AlertFeature):String{
    const props = feature.properties;
     return [
    `Event: ${props.event || "Unknown"}`,
    `Area: ${props.areaDesc || "Unknown"}`,
    `Severity: ${props.severity || "Unknown"}`,
    `Status: ${props.status || "Unknown"}`,
    `Headline: ${props.headline || "No headline"}`,
    "---",
  ].join("\n");
} 