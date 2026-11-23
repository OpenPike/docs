curl https://api.openpike.dev/v1/responses \
  -H "Authorization: Bearer $OPENPIKE_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-openpike-tags: agent=docs-example,env=dev" \
  -d '{
    "model": "openai/gpt-5.4-mini",
    "input": "Say hello in five words.",
    "store": false
  }'
