import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.openpike.dev/v1",
  apiKey: process.env.OPENPIKE_API_KEY,
  defaultHeaders: { "x-openpike-tags": "agent=quickstart" },
});

const response = await client.chat.completions.create({
  model: "deepseek/deepseek-flash",
  messages: [{ role: "user", content: "Say hello in five words." }],
});
console.log(response.choices[0]?.message.content);
