import type { ContactPayload, ContactResponse } from "../interfaces/contact";

// Client-side — posts the contact form to our own /api/contact route.
export const sendContactMessage = async (payload: ContactPayload) => {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: ContactResponse = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong");
  }

  return data;
};
