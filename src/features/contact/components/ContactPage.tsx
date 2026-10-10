import { Container } from "@/shared/components/Container";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";
import { ContactForm } from "./ContactForm";

export const ContactPage = () => {
  return (
    <main>
      <Container>
        <Heading>Contact</Heading>
        <SubHeading>
          Have a question, a project idea, or just want to say hello? I would love to{" "}
          <span className="highlight">hear from you</span>.
        </SubHeading>
        <ContactForm className="card-chai border-card-edge bg-card-fill p-6 shadow-none sm:p-8 dark:border-card-edge dark:bg-card-fill" />
      </Container>
    </main>
  );
};
