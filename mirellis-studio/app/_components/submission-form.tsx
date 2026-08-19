"use client";

import { useActionState } from "react";
import { createSubmission, updateSubmission } from "@/app/actions/submissions";
import type { Submission, SubmissionDisclosure, SubmissionSource } from "@/lib/editorial";
import type { ActionState } from "@/lib/validation";

const initialState: ActionState = { ok: false, message: "" };

type Props = {
  submission?: Submission;
  disclosure?: SubmissionDisclosure | null;
  sources?: SubmissionSource[];
};

export function SubmissionForm({ submission, disclosure, sources = [] }: Props) {
  const action = submission ? updateSubmission.bind(null, submission.id) : createSubmission;
  const [state, formAction, pending] = useActionState(action, initialState);
  const sourceRows = [1, 2, 3].map((position) => sources.find((source) => source.position === position));

  return (
    <form action={formAction} className="editorial-form">
      <section className="form-section" aria-labelledby="shape-heading">
        <div className="form-section-intro">
          <span>01</span>
          <div><h2 id="shape-heading">Shape the contribution</h2><p>Choose the honest form and the nearest Mirellis territory.</p></div>
        </div>
        <div className="form-grid two-columns">
          <Field label="Contribution format" htmlFor="format">
            <select id="format" name="format" defaultValue={submission?.format ?? ""} required>
              <option value="" disabled>Choose one</option>
              <option value="evidence_note">Evidence Note — explains a bounded evidence question</option>
              <option value="expert_commentary">Expert Commentary — interprets practice with named expertise</option>
            </select>
          </Field>
          <Field label="Territory" htmlFor="territory">
            <select id="territory" name="territory" defaultValue={submission?.territory ?? ""} required>
              <option value="" disabled>Choose one</option>
              <option value="sleep">Sleep</option>
              <option value="focus">Focus</option>
              <option value="restoration">Restoration</option>
              <option value="human_state_transition">Human State Transition</option>
            </select>
          </Field>
        </div>
        <Field label="Working title" htmlFor="title" help="Keep the title narrower than the evidence.">
          <input id="title" name="title" defaultValue={submission?.title} minLength={8} maxLength={180} required />
        </Field>
        <Field label="Bounded statement" htmlFor="bounded_statement" help="Write exactly what this contribution can responsibly say—not the largest possible claim.">
          <textarea id="bounded_statement" name="bounded_statement" defaultValue={submission?.bounded_statement} minLength={40} maxLength={1200} required />
        </Field>
      </section>

      <section className="form-section" aria-labelledby="contribution-heading">
        <div className="form-section-intro">
          <span>02</span>
          <div><h2 id="contribution-heading">Make the reasoning inspectable</h2><p>Separate the contribution, its basis and its limitations.</p></div>
        </div>
        <Field label="Contribution text" htmlFor="contribution_text">
          <textarea className="long-text" id="contribution_text" name="contribution_text" defaultValue={submission?.contribution_text} minLength={120} maxLength={20000} required />
        </Field>
        <Field label="Evidence basis" htmlFor="evidence_basis" help="Describe the study types, lived evidence or professional basis being used.">
          <textarea id="evidence_basis" name="evidence_basis" defaultValue={submission?.evidence_basis} minLength={40} maxLength={4000} required />
        </Field>
        <Field label="Material limitations" htmlFor="limitations" help="State what this contribution cannot establish or where it may not generalise.">
          <textarea id="limitations" name="limitations" defaultValue={submission?.limitations} minLength={40} maxLength={3000} required />
        </Field>
      </section>

      <section className="form-section" aria-labelledby="sources-heading">
        <div className="form-section-intro">
          <span>03</span>
          <div><h2 id="sources-heading">Map each source to a claim</h2><p>The first source is required. Add the second and third only when they do real work.</p></div>
        </div>
        {sourceRows.map((source, index) => (
          <fieldset className="source-card" key={index}>
            <legend>Source {index + 1}{index === 0 ? " · required" : " · optional"}</legend>
            <Field label="Human-readable citation" htmlFor={`source_${index + 1}_citation`}>
              <textarea id={`source_${index + 1}_citation`} name={`source_${index + 1}_citation`} defaultValue={source?.citation} required={index === 0} />
            </Field>
            <Field label="Stable HTTPS link or DOI" htmlFor={`source_${index + 1}_url`}>
              <input id={`source_${index + 1}_url`} name={`source_${index + 1}_url`} type="url" defaultValue={source?.url} required={index === 0} />
            </Field>
            <div className="form-grid two-columns">
              <Field label="What it supports" htmlFor={`source_${index + 1}_supports`}>
                <textarea id={`source_${index + 1}_supports`} name={`source_${index + 1}_supports`} defaultValue={source?.supports} required={index === 0} />
              </Field>
              <Field label="What it does not support" htmlFor={`source_${index + 1}_does_not_support`}>
                <textarea id={`source_${index + 1}_does_not_support`} name={`source_${index + 1}_does_not_support`} defaultValue={source?.does_not_support} required={index === 0} />
              </Field>
            </div>
          </fieldset>
        ))}
      </section>

      <section className="form-section" aria-labelledby="credit-heading">
        <div className="form-section-intro">
          <span>04</span>
          <div><h2 id="credit-heading">Credit and disclose</h2><p>Disclosure makes judgment possible; it does not automatically disqualify a contribution.</p></div>
        </div>
        <Field label="Contributor credit" htmlFor="contributor_credit" help="Name and professional context as you want it assessed by the editor.">
          <input id="contributor_credit" name="contributor_credit" defaultValue={submission?.contributor_credit} maxLength={180} required />
        </Field>
        <fieldset className="checkbox-group">
          <legend>Contribution roles</legend>
          {[
            ["conceptualization", "Conceptualization"],
            ["investigation", "Investigation"],
            ["methodology", "Methodology"],
            ["writing_original", "Writing — original draft"],
            ["writing_review", "Writing — review and editing"],
          ].map(([value, label]) => (
            <label className="check-row" key={value}>
              <input type="checkbox" name="contribution_roles" value={value} defaultChecked={submission?.contribution_roles.includes(value)} />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
        <Field label="Funding" htmlFor="funding" help="Name direct funding separately from general institutional support. Write ‘None’ when applicable.">
          <textarea id="funding" name="funding" defaultValue={disclosure?.funding} required />
        </Field>
        <Field label="Relevant interests" htmlFor="interests" help="Include employment, ownership, consulting, commercial, personal or intellectual interests. Write ‘None’ when applicable.">
          <textarea id="interests" name="interests" defaultValue={disclosure?.interests} required />
        </Field>
        <Field label="Material AI assistance" htmlFor="ai_assistance" help="Name the tool category and purpose. Write ‘None’ when applicable; AI cannot be an author.">
          <textarea id="ai_assistance" name="ai_assistance" defaultValue={disclosure?.ai_assistance} required />
        </Field>
        <label className="check-row consent-row">
          <input type="checkbox" name="confidential_ai_permission" defaultChecked={disclosure?.confidential_ai_permission} />
          <span>I permit Mirellis to use confidentially governed AI assistance on this draft if a later workflow explicitly provides it. Leaving this unticked will not affect review.</span>
        </label>
        <label className="check-row consent-row">
          <input type="checkbox" name="human_accountability_confirmed" defaultChecked={disclosure?.human_accountability_confirmed} required />
          <span>I confirm that a human contributor is accountable for every source, statement, permission and disclosure in this submission.</span>
        </label>
      </section>

      <div className="form-finish">
        <div>
          <p className="eyebrow">Private draft</p>
          <p>Saving does not submit this work. You can review it before starting editorial review.</p>
        </div>
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : submission ? "Save private draft" : "Create private draft"}
        </button>
      </div>
      <p className={`form-status ${state.ok ? "status-success" : ""}`} aria-live="polite">{state.message}</p>
    </form>
  );
}

function Field({ label, htmlFor, help, children }: { label: string; htmlFor: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {help && <p className="field-help" id={`${htmlFor}-help`}>{help}</p>}
      {children}
    </div>
  );
}
