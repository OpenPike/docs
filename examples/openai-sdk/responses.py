import os

from openai import OpenAI

client = OpenAI(
    base_url="https://api.openpike.dev/v1",
    api_key=os.environ["OPENPIKE_API_KEY"],
    default_headers={"x-openpike-tags": "agent=docs-example,env=dev"},
)

response = client.responses.create(
    model="openai/gpt-5.4-mini",
    input="Say hello in five words.",
    store=False,
)
print(response.output_text)
print(response.usage.input_tokens, response.usage.output_tokens)
