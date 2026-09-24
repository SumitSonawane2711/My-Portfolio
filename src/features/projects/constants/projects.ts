import type { Project } from "../interfaces/project";

export const projects: Project[] = [
  {
    title: "Enterprise Document Management System",
    subtitle: "Enterprise Document Management Platform | In Progress",
    slug: "enterprise-document-management-system",
    src: [
      "/projects/edms/ss1.png",
      "/projects/edms/ss2.png",
      "/projects/edms/ss3.png",
      "/projects/edms/ss4.png",
    ],
    description:
      "A secure enterprise platform that digitizes employee document management by centralizing HR records, automating document workflows, and providing role-based access for secure storage, retrieval, and lifecycle management.",
    href: "#",
    date: "July 2026",
    technologies: ["React", "Adonis.js", "PostgreSQL", "TypeScript"],
  },
  {
    title: "PetExpress | Multi-Portal Pet-Care Rewards Platform",
    subtitle: "multi-portal pet-care rewards platform",
    slug: "petexpress",
    src: ["/projects/petexpress/ss1.png"],
    description:
      "Developed a scalable multi-portal pet-care platform featuring secure AdonisJS APIs, a loyalty and rewards engine, partner management, role-based authentication, and React-powered partner portals. Built to connect pet owners with businesses through a modern, high-performance SaaS architecture.",
    href: "#",
    date: "June 2026",
    technologies: ["React", "Adonis.js", "PostgreSQL", "TypeScript"],
  },
  {
    title: "Rwaltz Web Platform Admin Dashboard",
    subtitle: "Full-Stack Enterprise CMS & Corporate Platform ",
    slug: "rwaltz-web-platform",
    src: ["/projects/rwaltz-admin/ss1.png"],
    description:
      "Developed a production-ready enterprise platform featuring a secure AdonisJS API, RBAC-enabled React admin dashboard, and SEO-optimized corporate website.",
    href: "#",
    date: "june 2026",
    technologies: ["React", "Adonis.js", "MySQL", "TypeScript"],
  },
  // {
  //     title: "SnapGram | Social Media Platform",
  //     subtitle: "Social Media Platform | Full-Stack Web Application",
  //     slug: "snapgram",
  //     src: "/blog.jpg",
  //     description: "Developed a full-featured social media platform with secure authentication, real-time user interactions, post management, profile customization, and infinite scrolling using React, TanStack Query, Appwrite, and Tailwind CSS.",
  //     href: '#',
  //     date: "2023-03-31",
  //     technologies: ["Next.js", "Express.js","MongoDB", "TypeScript", "Tailwind CSS"],
  //     image:'/projects/snapgram/ss1.png'
  // },
  // {
  //     title: "ELearning Platform ",
  //     subtitle: "Learning Management System | Admin Portal",
  //     slug: "elearning-admin-dashboard",
  //     src: "/blog.jpg",
  //     description: "Built a production-ready admin dashboard for managing courses, categories, users, instructors, enrollments, and media assets. Developed secure REST APIs, authentication, role-based access, and reusable React components while deploying the platform on a VPS for reliable production hosting.",
  //     href: '#',
  //     date: "2023-03-31",
  //     technologies: ["React", "Express.js", "MySQL", "TypeScript", "Tailwind CSS"],

  // }
];
