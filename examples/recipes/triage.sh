curl https://api.openpike.dev/v1/systemone \
  -H "Authorization: Bearer $OPENPIKE_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-openpike-tags: agent=triage" \
  -d '{
    "model": "typesafe/jev-1.13.0",
    "state": {"ticket": "Customer reports the checkout page returns a 500 error for all users."},
    "questions": [{"id": "urgent", "type": "noul", "question": "Is this ticket urgent?"}]
  }'
