export type ProfessionalExperience = {
  companyName: string;
  role: string;
  slug: string;
  url: string;
  technologies: string[];
  dateFrom: string;
  dateTo: string;
  description: string;
};

export type ExperienceFrontmatter = {
  companyName: string;
  description: string;
  url?: string;
  technologies?: string[];
  dateFrom: string;
  dateTo: string;
};
