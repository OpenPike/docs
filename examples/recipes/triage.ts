const ticket = "Customer reports the checkout page returns a 500 error for all users.";

const res = await fetch("https://api.openpike.dev/v1/systemone", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.OPENPIKE_API_KEY}`,
    "Content-Type": "application/json",
    "x-openpike-tags": "agent=triage",
  },
  body: JSON.stringify({
    model: "typesafe/jev-1.13.0",
    state: { ticket },
    questions: [{ id: "urgent", type: "noul", question: "Is this ticket urgent?" }],
  }),
});
if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
const decision = (await res.json()) as { answers: unknown };
console.log(decision.answers);
