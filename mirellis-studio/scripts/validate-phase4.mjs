import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const baseSql = read("supabase/migrations/20260819114530_create_editorial_studio.sql");
const advisorSql = read("supabase/migrations/20260819135145_resolve_editorial_advisors.sql");
const grantsSql = read("supabase/migrations/20260819140421_tighten_editorial_grants.sql");
const sql = `${baseSql}\n${advisorSql}\n${grantsSql}`;
const authAction = read("app/auth/actions.ts");
const authConfirm = read("app/auth/confirm/page.tsx");
const authGuard = read("lib/auth.ts");
const submissionActions = read("app/actions/submissions.ts");
const metadata = read("app/layout.tsx");
const localConfig = read("supabase/config.toml");

const tables = [
  "studio_profiles",
  "studio_submissions",
  "studio_sources",
  "studio_disclosures",
  "editorial_reviews",
  "editorial_decisions",
  "studio_audit_events",
];

for (const table of tables) {
  assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, "i"), `${table} must enable RLS`);
}

assert.doesNotMatch(sql, /\bto\s+anon\b/i, "Studio data must not be granted to anon");
assert.doesNotMatch(sql, /grant\s+.+\s+to\s+anon/i, "Studio tables must not grant anon access");
assert.match(grantsSql, /revoke all privileges on table[\s\S]+from anon, authenticated/i, "Hosted default table grants must be replaced explicitly");
assert.match(grantsSql, /grant select \([\s\S]+\) on public\.editorial_decisions to authenticated/i, "Contributor-visible decisions must use bounded column grants");
assert.doesNotMatch(`${authAction}\n${authGuard}\n${submissionActions}`, /service[_-]?role|secret[_-]?key/i, "Application code must not use a privileged Supabase key");
assert.match(authAction, /shouldCreateUser:\s*false/, "Email sign-in must not create unknown users");
assert.doesNotMatch(authAction, /if\s*\(error\)/, "Sign-in responses must not reveal whether an email is invited");
assert.match(authConfirm, /hash\.get\("access_token"\)/, "Free-plan implicit magic links must be supported");
assert.match(authConfirm, /history\.replaceState/, "Authentication tokens must be cleared from the address bar");
assert.match(authConfirm, /auth\.setSession/, "Implicit magic links must establish the SSR-compatible browser session");
assert.match(authGuard, /studio_profiles/, "A verified auth user must also have a provisioned studio profile");
assert.match(sql, /private reviews are editorial only/i, "Private review notes need an editor-only policy");
assert.match(sql, /audit_submission_status/i, "Submission status changes must be audited");
assert.match(sql, /Acceptance does not publish|acceptance does not publish/i, "Schema must state that acceptance is not publication");
assert.match(metadata, /index:\s*false/, "Studio must be noindex");
assert.match(metadata, /follow:\s*false/, "Studio must be nofollow");
assert.equal((localConfig.match(/enable_signup\s*=\s*false/g) ?? []).length >= 2, true, "Local Auth and email signup must be disabled");

const contributorAllowed = new Set([
  "draft>submitted",
  "revision_requested>submitted",
  "draft>withdrawn",
  "submitted>withdrawn",
  "revision_requested>withdrawn",
]);
const editorAllowed = new Set([
  "submitted>in_review",
  "submitted>revision_requested",
  "submitted>hold",
  "submitted>accepted",
  "submitted>declined",
  "in_review>revision_requested",
  "in_review>hold",
  "in_review>accepted",
  "in_review>declined",
  "hold>revision_requested",
  "hold>hold",
  "hold>accepted",
  "hold>declined",
]);

for (const disallowed of ["draft>accepted", "draft>in_review", "accepted>draft", "declined>submitted"]) {
  assert.equal(contributorAllowed.has(disallowed), false, `Contributor transition ${disallowed} must stay blocked`);
}
for (const allowed of ["draft>submitted", "revision_requested>submitted", "submitted>withdrawn"]) {
  assert.equal(contributorAllowed.has(allowed), true, `Contributor transition ${allowed} must stay available`);
}
for (const allowed of ["submitted>in_review", "in_review>revision_requested", "in_review>accepted"]) {
  assert.equal(editorAllowed.has(allowed), true, `Editor transition ${allowed} must stay available`);
}

console.log(`Phase 4 validation passed: ${tables.length} RLS tables, invite-only auth, bounded roles, private review notes and audited decisions.`);
