export type Project = {
  title: string;
  subtitle?: string;
  slug: string;
  src: string[];
  description: string;
  href: string;
  date?: string;
  technologies?: string[];
};

export type ProjectFrontmatter = {
  title: string;
  description: string;
  image?: string;
};
