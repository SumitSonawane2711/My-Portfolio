import { ContactForm } from "../components/contact-form";
import Container from "../components/container";
import { Heading } from "../components/heading";
import { SubHeading } from "../components/subheading";



export default function ContactPage() {



    return (
        <main className="min-h-screen flex items-start justify-start ">
            <Container className="min-h-screen p-4 md:pt-20 md:pb-10">
                <Heading >Contact Page Headings</Heading>
                <SubHeading >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, unde facere! Necessitatibus numquam iusto assumenda. Ullam quaerat exercitationem nesciunt porro!
                </SubHeading>
                <ContactForm/>
            </Container>
        </main>
    );
}
