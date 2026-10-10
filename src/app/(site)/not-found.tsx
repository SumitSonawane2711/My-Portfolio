import Link from "next/link";
import { Container } from "@/shared/components/Container";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";
import { ChaiButton } from "@/shared/components/chai/Button";

export default function NotFound() {
  return (
    <main>
      <Container className="py-24 text-center sm:py-32">
        <Heading>Page not found</Heading>
        <SubHeading>The page you are looking for doesn&apos;t exist or has moved.</SubHeading>
        <ChaiButton asChild variant="solid" className="mt-8">
          <Link href="/">Back home</Link>
        </ChaiButton>
      </Container>
    </main>
  );
}
