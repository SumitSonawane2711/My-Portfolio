import { createAuthClient } from "better-auth/react";

// Browser client for sign-in / sign-out. Same origin, so no baseURL needed.
export const authClient = createAuthClient();
