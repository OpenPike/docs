import os

import httpx

ticket = "Customer reports the checkout page returns a 500 error for all users."

decision = httpx.post(
    "https://api.openpike.dev/v1/systemone",
    headers={
        "Authorization": f"Bearer {os.environ['OPENPIKE_API_KEY']}",
        "x-openpike-tags": "agent=triage",
    },
    json={
        "model": "typesafe/jev-1.13.0",
        "state": {"ticket": ticket},
        "questions": [{"id": "urgent", "type": "noul", "question": "Is this ticket urgent?"}],
    },
    timeout=30,
)
decision.raise_for_status()
print(decision.json()["answers"])
