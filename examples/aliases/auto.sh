curl -i https://api.openpike.dev/v1/chat/completions \
  -H "Authorization: Bearer $OPENPIKE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openpike/auto",
    "messages": [{"role": "user", "content": "Name one river in Europe."}]
  }'
