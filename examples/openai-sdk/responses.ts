import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.openpike.dev/v1",
  apiKey: process.env.OPENPIKE_API_KEY,
  defaultHeaders: { "x-openpike-tags": "agent=docs-example,env=dev" },
});

const response = await client.responses.create({
  model: "openai/gpt-5.4-mini",
  input: "Say hello in five words.",
  store: false,
});
console.log(response.output_text);
console.log(response.usage?.input_tokens, response.usage?.output_tokens);
