import "server-only";
import { Resolver } from "node:dns/promises";
import disposableDomains from "disposable-email-domains";

// Throwaway inbox providers (mailinator, 10minutemail, …): ~120k domains,
// loaded once per server instance.
let disposable: Set<string> | undefined;
const isDisposable = (domain: string) =>
  (disposable ??= new Set(disposableDomains)).has(domain) ||
  // Subdomains of a throwaway provider too (x.mailinator.com).
  domain.split(".").some((_, i, parts) => i > 0 && disposable!.has(parts.slice(i).join(".")));

const DNS_TIMEOUT_MS = 3000;

// Public DNS servers, so the check works the same on every host.
let resolver: Resolver | undefined;
const getResolver = () => {
  if (!resolver) {
    resolver = new Resolver({ timeout: 1500, tries: 2 });
    resolver.setServers(["1.1.1.1", "8.8.8.8"]);
  }
  return resolver;
};

/**
 * Can this domain receive email? It needs a real mail server (MX record);
 * "null MX" domains such as example.com explicitly can't. A slow or failing
 * DNS lookup counts as yes, so a DNS hiccup never blocks a real visitor.
 */
async function acceptsMail(domain: string) {
  try {
    const records = await Promise.race([
      getResolver().resolveMx(domain),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), DNS_TIMEOUT_MS)),
    ]);
    if (records === null) return true; // timed out
    return records.some((record) => record.exchange && record.exchange !== ".");
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    // The domain doesn't exist, or has no mail server at all.
    return !(code === "ENOTFOUND" || code === "ENODATA" || code === "ENOTIMP");
  }
}

/** Returns why an email address can't be used, or null when it looks real. */
export async function checkEmailAddress(email: string): Promise<string | null> {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return "Please enter a valid email address";
  if (isDisposable(domain)) {
    return "Temporary email addresses aren't accepted. Please use your real email.";
  }
  if (!(await acceptsMail(domain))) {
    return "This email domain can't receive email. Please check the address.";
  }
  return null;
}
