import { ContactForm } from "../components/contact-form";
import Container from "../components/container";
import { Heading } from "../components/heading";
import { SubHeading } from "../components/subheading";



export default function ContactPage() {



    return (
        <main className="min-h-screen flex items-start justify-start">
            <Container className="min-h-screen p-4 pt-20 md:pb-10">
                <Heading >Contact</Heading>
                <SubHeading >
                    I would love to hear from you! Whether you have a question, a project idea, or just want to say hello, feel free to reach out. Let&apos;s collaborate and create something amazing together!
                </SubHeading>
                <ContactForm/>
            </Container>
        </main>
    );
}
