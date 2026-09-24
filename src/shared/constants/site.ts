// Single source for personal/site details reused across features
// (Hero, Profile, Footer, Resume) — update here, not in the components.
export const SITE = {
  name: "Sumit Sonawane",
  phone: "+919423749105",
  experienceYears: 2,
  summary: "Motivated and detail-oriented MERN Stack Developer.",
} as const;

export const SOCIAL_LINKS = {
  github: "https://github.com/SumitSonawane2711",
  linkedin: "https://in.linkedin.com/in/sumit-sonawane-2b504b219",
} as const;

export const RESUME = {
  fileUrl: "/CV_Sumit_Sonawane_2026.pdf",
  fileName: "CV_Sumit_Sonawane_2026.pdf",
} as const;
