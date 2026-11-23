import os

from anthropic import Anthropic

client = Anthropic(
    base_url="https://api.openpike.dev",
    api_key=os.environ["OPENPIKE_API_KEY"],
)

message = client.messages.create(
    model="anthropic/claude-haiku-5-5",
    max_tokens=100,
    messages=[{"role": "user", "content": "Say hello in five words."}],
    extra_headers={"x-openpike-tags": "agent=quickstart"},
)
print(message.content[0].text)
