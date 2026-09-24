import { Container } from "@/shared/components/Container";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";
import { Timeline } from "./Timeline";

export const AboutPage = () => {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen p-4 md:pt-20 md:pb-10">
        <Heading>Hellow I am Sumit</Heading>
        <SubHeading>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, unde facere!
          Necessitatibus numquam iusto assumenda. Ullam quaerat exercitationem nesciunt porro!
        </SubHeading>
        <div className="min-h-[400px] rounded-lg bg-neutral-200 dark:bg-neutral-800"></div>
        <p className="max-w-lg pt-4 text-sm text-secondary md:text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, unde facere!
          Necessitatibus numquam iusto assumenda. Ullam quaerat exercitationem nesciunt porro!
        </p>
        <Timeline />
      </Container>
    </main>
  );
};
