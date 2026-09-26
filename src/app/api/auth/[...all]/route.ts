import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/shared/libs/auth";

export const { GET, POST } = toNextJsHandler(auth);
