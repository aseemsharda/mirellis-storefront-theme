import type { SubmissionFormat, StudioTerritory } from "@/lib/editorial";

export type ActionState = { ok: boolean; message: string; field?: string };

const formats = new Set<SubmissionFormat>(["evidence_note", "expert_commentary"]);
const territories = new Set<StudioTerritory>(["sleep", "focus", "restoration", "human_state_transition"]);

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function within(value: string, min: number, max: number) {
  return value.length >= min && value.length <= max;
}

export function parseSubmission(formData: FormData) {
  const format = text(formData, "format") as SubmissionFormat;
  const territory = text(formData, "territory") as StudioTerritory;
  const title = text(formData, "title");
  const boundedStatement = text(formData, "bounded_statement");
  const contributionText = text(formData, "contribution_text");
  const evidenceBasis = text(formData, "evidence_basis");
  const limitations = text(formData, "limitations");
  const contributorCredit = text(formData, "contributor_credit");
  const contributionRoles = formData.getAll("contribution_roles").map(String).filter(Boolean);
  const funding = text(formData, "funding");
  const interests = text(formData, "interests");
  const aiAssistance = text(formData, "ai_assistance");
  const humanAccountability = formData.get("human_accountability_confirmed") === "on";

  const checks: Array<[boolean, string, string]> = [
    [formats.has(format), "Choose a contribution format.", "format"],
    [territories.has(territory), "Choose the nearest territory.", "territory"],
    [within(title, 8, 180), "Use a title between 8 and 180 characters.", "title"],
    [within(boundedStatement, 40, 1200), "State the bounded claim in 40–1,200 characters.", "bounded_statement"],
    [within(contributionText, 120, 20000), "The contribution must be at least 120 characters.", "contribution_text"],
    [within(evidenceBasis, 40, 4000), "Explain the evidence basis in at least 40 characters.", "evidence_basis"],
    [within(limitations, 40, 3000), "Name material limitations in at least 40 characters.", "limitations"],
    [within(contributorCredit, 2, 180), "Add the contributor credit as it should be reviewed.", "contributor_credit"],
    [contributionRoles.length > 0, "Select at least one contribution role.", "contribution_roles"],
    [within(funding, 2, 2000), "State the funding position, including ‘None’. ", "funding"],
    [within(interests, 2, 2000), "State relevant interests, including ‘None’. ", "interests"],
    [within(aiAssistance, 2, 2000), "Describe material AI assistance, including ‘None’. ", "ai_assistance"],
    [humanAccountability, "Confirm that a human is accountable for the submission.", "human_accountability_confirmed"],
  ];

  for (const [valid, message, field] of checks) {
    if (!valid) return { success: false as const, error: { ok: false, message, field } satisfies ActionState };
  }

  const sources = [1, 2, 3]
    .map((position) => ({
      position,
      citation: text(formData, `source_${position}_citation`),
      url: text(formData, `source_${position}_url`),
      supports: text(formData, `source_${position}_supports`),
      does_not_support: text(formData, `source_${position}_does_not_support`),
    }))
    .filter((source) => Object.values(source).some((value) => typeof value === "string" && value.length > 0));

  if (sources.length === 0) {
    return { success: false as const, error: { ok: false, message: "Add at least one source.", field: "source_1_citation" } satisfies ActionState };
  }
  for (const source of sources) {
    if (!within(source.citation, 8, 1200)) return { success: false as const, error: { ok: false, message: `Complete source ${source.position} citation.`, field: `source_${source.position}_citation` } satisfies ActionState };
    try {
      const url = new URL(source.url);
      if (url.protocol !== "https:") throw new Error();
    } catch {
      return { success: false as const, error: { ok: false, message: `Source ${source.position} needs a complete HTTPS link.`, field: `source_${source.position}_url` } satisfies ActionState };
    }
    if (!within(source.supports, 20, 1200) || !within(source.does_not_support, 20, 1200)) {
      return { success: false as const, error: { ok: false, message: `Explain what source ${source.position} supports and does not support.`, field: `source_${source.position}_supports` } satisfies ActionState };
    }
  }

  return {
    success: true as const,
    data: {
      submission: {
        format,
        territory,
        title,
        bounded_statement: boundedStatement,
        contribution_text: contributionText,
        evidence_basis: evidenceBasis,
        limitations,
        contributor_credit: contributorCredit,
        contribution_roles: contributionRoles,
      },
      disclosure: {
        funding,
        interests,
        ai_assistance: aiAssistance,
        confidential_ai_permission: formData.get("confidential_ai_permission") === "on",
        human_accountability_confirmed: humanAccountability,
      },
      sources,
    },
  };
}
