import Link from "next/link";
import { Container } from "@/shared/components/Container";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen p-4 pt-20 md:pb-10">
        <Heading>Page not found</Heading>
        <SubHeading>The page you are looking for doesn&apos;t exist or has moved.</SubHeading>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-primary">
          Back home
        </Link>
      </Container>
    </main>
  );
}
