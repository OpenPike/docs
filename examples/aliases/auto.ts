import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.openpike.dev/v1",
  apiKey: process.env.OPENPIKE_API_KEY,
});

const { data, response } = await client.chat.completions
  .create({
    model: "openpike/auto",
    messages: [{ role: "user", content: "Name one river in Europe." }],
  })
  .withResponse();
console.log("served by", response.headers.get("x-openpike-model"), "after", response.headers.get("x-openpike-attempts"), "attempt(s)");
console.log(data.choices[0]?.message.content);
