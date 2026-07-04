export type Project = {
    title : string;
    subtitle? : string;
    slug:string,
    src : string;
    description : string;
    href : string;
    dateFrom?: string;
    dateTo?: string;
}

export const projects: Project[] = [
       {
            title: "Employee Document Management System (EDMS)",
            subtitle: "Enterprise Document Management Platform | In Progress",
            slug: "employee-document-management-system",
            src: "/blog.jpg",
            description: "A secure enterprise platform that digitizes employee document management by centralizing HR records, automating document workflows, and providing role-based access for secure storage, retrieval, and lifecycle management.",
            href: '#',
            dateFrom: "2023-01-01",
            dateTo: "2023-03-31"       
        },
        {
            title: "PetExpress",
            subtitle: "multi-portal pet-care rewards platform",
            slug: "petexpress",
            src: "/blog.jpg",
            description: "Developed a scalable multi-portal pet-care platform featuring secure AdonisJS APIs, a loyalty and rewards engine, partner management, role-based authentication, and React-powered partner portals. Built to connect pet owners with businesses through a modern, high-performance SaaS architecture.",
            href: '#',
            dateFrom: "2023-01-01",
            dateTo: "2023-03-31"
        },
        {
            title: "Rwaltz Web Platform",
            subtitle: "Full-Stack Enterprise CMS & Corporate Platform ",
            slug: "rwaltz-web-platform",
            src: "/blog.jpg",
            description:"Developed a production-ready enterprise platform featuring a secure AdonisJS API, RBAC-enabled React admin dashboard, and SEO-optimized corporate website. The platform empowers teams to manage business content, client enquiries, careers, blogs, portfolios, and digital assets through a scalable, modern architecture.",
            href: '#',
            dateFrom: "2023-01-01",
            dateTo: "2023-03-31"
        },
        {
            title: "SnapGram",
            subtitle: "Social Media Platform | Full-Stack Web Application",
            slug: "snapgram",
            src: "/blog.jpg",
            description: "Developed a full-featured social media platform with secure authentication, real-time user interactions, post management, profile customization, and infinite scrolling using React, TanStack Query, Appwrite, and Tailwind CSS.",
            href: '#',
            dateFrom: "2023-01-01",
            dateTo: "2023-03-31"
        },
        {
            title: "eLearning Admin Dashboard",
            subtitle: "Learning Management System | Admin Portal",
            slug: "elearning-admin-dashboard",
            src: "/blog.jpg",
            description: "Built a production-ready admin dashboard for managing courses, categories, users, instructors, enrollments, and media assets. Developed secure REST APIs, authentication, role-based access, and reusable React components while deploying the platform on a VPS for reliable production hosting.",
            href: '#',
            dateFrom: "2023-01-01",
            dateTo: "2023-03-31"
        }

    ]
