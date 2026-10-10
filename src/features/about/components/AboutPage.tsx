import { Container } from "@/shared/components/Container";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";
import { getSettings } from "@/features/settings/queries/settingsQueries";
import { Timeline } from "./Timeline";

export const AboutPage = async () => {
  const { about } = await getSettings();

  return (
    <main>
      <Container>
        <Heading>Hellow I am Sumit</Heading>
        <SubHeading>
          {about ||
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, unde facere! Necessitatibus numquam iusto assumenda. Ullam quaerat exercitationem nesciunt porro!"}
        </SubHeading>
        <div className="mt-10 min-h-[400px] card-chai"></div>
        <p className="max-w-lg pt-4 text-sm text-secondary md:text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, unde facere!
          Necessitatibus numquam iusto assumenda. Ullam quaerat exercitationem nesciunt porro!
        </p>
        <Timeline />
      </Container>
    </main>
  );
};
