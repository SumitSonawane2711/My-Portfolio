import Container from "../components/container";
import { Heading } from "../components/heading";
import { Projects } from "../components/projects";
import { SubHeading } from "../components/subheading";
import { projects } from "../constants/projects";



export default function ProjectsPage() {
    return (
        <div className="min-h-screen flex items-start justify-start ">
            <Container className="min-h-screen px-10 pt-20 md:pb-10">
                <Heading>
                    Projects
                </Heading>
                {/* <SubHeading>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores qui adipisci, velit similique quidem odio iste non perspiciatis corporis aliquid.
                </SubHeading> */}
                <Projects projects={projects}/>
            </Container>
        </div>
    )
}