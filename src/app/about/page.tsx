import Container from "../components/container";
import { Heading } from "../components/heading";
import { SubHeading } from "../components/subheading";
import { Timeline } from "../components/timeline";



export default function AboutPage() {

    

  return (
    <main className="min-h-screen flex items-start justify-start ">
      <Container className="min-h-screen p-4 md:pt-20 md:pb-10">
        <Heading >Hellow I am Sumit</Heading>
        <SubHeading >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, unde facere! Necessitatibus numquam iusto assumenda. Ullam quaerat exercitationem nesciunt porro!
        </SubHeading>
        <div className="min-h-[400px] rounded-lg bg-neutral-200 dark:bg-neutral-800">

        </div>
        <p className="text-secondary max-w-lg pt-4 text-sm md:text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, unde facere! Necessitatibus numquam iusto assumenda. Ullam quaerat exercitationem nesciunt porro!
        </p>
        <Timeline />
      </Container>
    </main>
  );
}
