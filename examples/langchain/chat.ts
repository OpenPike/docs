import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: "deepseek/deepseek-flash",
  apiKey: process.env.OPENPIKE_API_KEY,
  configuration: {
    baseURL: "https://api.openpike.dev/v1",
    defaultHeaders: { "x-openpike-tags": "agent=docs-example,env=dev" },
  },
});

const reply = await llm.invoke("Name one river in Europe.");
console.log(reply.content);
