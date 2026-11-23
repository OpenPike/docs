import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  baseURL: "https://api.openpike.dev",
  apiKey: process.env.OPENPIKE_API_KEY,
  defaultHeaders: { "x-openpike-tags": "agent=quickstart" },
});

const message = await client.messages.create({
  model: "anthropic/claude-haiku-5-5",
  max_tokens: 100,
  messages: [{ role: "user", content: "Say hello in five words." }],
});
const first = message.content[0];
console.log(first?.type === "text" ? first.text : first);
