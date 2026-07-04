export type ProfessionalExperience = {
    companyName: string;
    role: string;
    slug: string;
    url: string;
    technologies: string[];
    dateFrom: string;
    dateTo: string;
    description: string;
}

export const professionalExperience: ProfessionalExperience[] = [
    {
        companyName: "Rwaltz Software",
        role: "Software Developer",
        slug: "rwaltz-software",
        url: "https://www.rwaltz.com/",
        technologies: ["React", "Node.js", "Adonis.js", "MySQL","MongoDB","PostgreSQL", "TypeScript", "Tailwind CSS"],
        dateFrom: "Nov 2025",
        dateTo: "Present",
        description: "As a Software Developer at Rwaltz Software, Built and integrated secure RESTful APIs, authentication, and Role-Based Access Control (RBAC) using Node.js, Express.js, and Adonis.js. Collaborated with cross-functional teams in Agile sprints to deliver end-to-end features, optimize application performance, and ensure code quality through reviews and best practices.",
    },
    {
        companyName: "Sinss Digital",
        role: "Web Developer",
        slug: "sinss-digital",
        url: "https://sinss.in/",
        technologies: ["React", "Next.js", "TypeScript", "WordPress", "Shopify", "Tailwind CSS", "JavaScript", "HTML", "CSS"],
        dateFrom: "Feb 2025",
        dateTo: "Nov 2025",
        description: "Developing and delivering responsive websites and web applications using Next.js, React.js, TypeScript, WordPress, Shopify, and other modern web technologies. My role involves collaborating directly with clients to understand business requirements, translating them into intuitive and high-performing digital solutions, and ensuring seamless execution from development to deployment. I focus on creating scalable, user-centric applications with strong emphasis on UI/UX, performance, SEO, and maintainability.",
    },
        {
        companyName: "Paarsh Infotech",
        role: "MERN Stack Developer",
        slug: "paarsh-infotech",
        url: "https://www.paarshinfotech.com/",
        technologies: ["Next.js", "React", "Node.js","Express.js", "TypeScript", "Tailwind CSS"],
        dateFrom: "July 2024",
        dateTo: "Feb 2025",
        description: "As a MERN Stack Developer at Paarsh Infotech, I specialize in building and maintaining full-stack web applications using MongoDB, Express.js, React.js, and Node.js. My role involves designing robust backend services, creating dynamic front-end interfaces, and ensuring seamless integration between the two. I work closely with cross-functional teams to deliver high-performance, scalable solutions tailored to client needs.",
    },
]
