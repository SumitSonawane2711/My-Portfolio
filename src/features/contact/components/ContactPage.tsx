import { Container } from "@/shared/components/Container";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";
import { ContactForm } from "./ContactForm";

export const ContactPage = () => {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen p-4 pt-20 md:pb-10">
        <Heading>Contact</Heading>
        <SubHeading>
          I would love to hear from you! Whether you have a question, a project idea, or just want
          to say hello, feel free to reach out. Let&apos;s collaborate and create something amazing
          together!
        </SubHeading>
        <ContactForm />
      </Container>
    </main>
  );
};
