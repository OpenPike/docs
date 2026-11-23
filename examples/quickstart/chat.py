import os

from openai import OpenAI

client = OpenAI(
    base_url="https://api.openpike.dev/v1",
    api_key=os.environ["OPENPIKE_API_KEY"],
)

response = client.chat.completions.create(
    model="deepseek/deepseek-flash",
    messages=[{"role": "user", "content": "Say hello in five words."}],
    extra_headers={"x-openpike-tags": "agent=quickstart"},
)
print(response.choices[0].message.content)
