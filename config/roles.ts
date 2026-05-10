export const ROLES = ["guest", "candidate", "recruiter", "admin"] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_ACCESS: Record<Role, string[]> = {
  guest: ["Landing page", "Browse jobs", "Login", "Signup"],
  candidate: ["Candidate dashboard", "Profile management", "Job applications"],
  recruiter: ["Recruiter dashboard", "Company profile", "Job posting", "Applicant review"],
  admin: ["Platform administration", "User management", "Content and moderation"],
};
