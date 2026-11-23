curl https://api.openpike.dev/v1/chat/completions \
  -H "Authorization: Bearer $OPENPIKE_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-openpike-tags: agent=quickstart" \
  -d '{
    "model": "deepseek/deepseek-flash",
    "messages": [{"role": "user", "content": "Say hello in five words."}]
  }'
