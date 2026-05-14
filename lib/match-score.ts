type MatchInput = {
  jobLocation?: string | null;
  targetLocation?: string | null;
  teflRequired: boolean;
  teflStatus?: string | null;
  degreeStatus?: string | null;
  yearsExperience?: number | null;
  visaSupport: boolean;
  visaStatus?: string | null;
  availability?: string | null;
  employmentType?: string | null;
  employmentPreference?: string | null;
};

export function calculateMatchScore(input: MatchInput) {
  let total = 0; let points = 0;
  const add = (ok: boolean, weight = 1) => { total += weight; if (ok) points += weight; };
  add(!input.jobLocation || !input.targetLocation || input.jobLocation.toLowerCase() === input.targetLocation.toLowerCase(), 2);
  add(!input.teflRequired || (input.teflStatus ?? "").toLowerCase().includes("yes"));
  add((input.degreeStatus ?? "").toLowerCase().includes("yes"));
  add((input.yearsExperience ?? 0) >= 1);
  add(!input.visaSupport || !(input.visaStatus ?? "").toLowerCase().includes("need"));
  add(Boolean(input.availability));
  add(!input.employmentType || !input.employmentPreference || input.employmentType.toLowerCase() === input.employmentPreference.toLowerCase());
  return Math.round((points / total) * 100);
}
