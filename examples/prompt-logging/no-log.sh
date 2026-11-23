curl https://api.openpike.dev/v1/chat/completions \
  -H "Authorization: Bearer $OPENPIKE_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-openpike-no-log: 1" \
  -d '{
    "model": "deepseek/deepseek-flash",
    "messages": [{"role": "user", "content": "This request is never stored."}]
  }'
