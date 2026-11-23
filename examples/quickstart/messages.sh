curl https://api.openpike.dev/v1/messages \
  -H "x-api-key: $OPENPIKE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -H "x-openpike-tags: agent=quickstart" \
  -d '{
    "model": "anthropic/claude-haiku-5-5",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Say hello in five words."}]
  }'
