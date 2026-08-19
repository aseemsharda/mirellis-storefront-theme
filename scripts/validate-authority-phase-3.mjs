#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(file, 'utf8');
const parseShopifyJson = (source) => JSON.parse(source.replace(/^\/\*[\s\S]*?\*\/\s*/, ''));

const [section, css, assignedSource, canonicalSource, policy, schema, sources, checklist, execution] = await Promise.all([
  read('sections/mirellis-evidence-register.liquid'),
  read('assets/mirellis-evidence-register.css'),
  read('templates/page.observatory-hub.json'),
  read('templates/page.the-observatory.json'),
  read('docs/authority-infrastructure/editorial-governance-v1.md'),
  read('docs/authority-infrastructure/public-record-schema-v1.md'),
  read('docs/authority-infrastructure/phase3-source-register.csv'),
  read('docs/authority-infrastructure/editorial-review-checklist-v1.md'),
  read('docs/authority-infrastructure/execution-register.md'),
]);

const assigned = parseShopifyJson(assignedSource);
const canonical = parseShopifyJson(canonicalSource);
const requiredFields = [
  'number', 'territory', 'status', 'version', 'published', 'published_iso', 'reviewed', 'reviewed_iso',
  'next_review', 'author', 'reviewer', 'title', 'statement', 'evidence_basis', 'limitation',
  'source_1_citation', 'source_1_url', 'source_1_scope', 'disclosure', 'ai_disclosure', 'change_note',
];

for (const template of [assigned, canonical]) {
  const records = Object.values(template.sections.evidence_register.blocks);
  assert.equal(records.length, 3, 'Phase 3 must preserve exactly the three reviewed public records.');
  for (const record of records) {
    for (const field of requiredFields) {
      assert.ok(record.settings[field], `Record ${record.settings.number || 'unknown'} is missing ${field}.`);
    }
    assert.match(record.settings.published_iso, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(record.settings.reviewed_iso, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(record.settings.reviewer, /not external peer review/i, 'Review level must not imply external peer review.');
    assert.match(record.settings.ai_disclosure, /AI assisted/i, 'Material AI assistance must be public.');
    assert.doesNotMatch(record.settings.limitation, /proven to improve/i, 'Limitations must not contain positive outcome claims.');
  }
}

assert.match(section, /id="\{\{ record_id \}\}"/, 'Every public record must expose a stable anchor.');
assert.match(section, /Permanent link to record/, 'Every record must expose its permanent link.');
assert.match(section, /How to cite this record/, 'Every record must expose human-readable citation text.');
assert.match(section, /Sources and provenance/, 'Every record must expose source provenance.');
assert.match(section, /Interests and funding/, 'Every record must expose interests and funding.');
assert.match(section, /AI assistance/, 'Every record must expose AI assistance.');
assert.match(section, /Editorial standards and corrections/, 'The public register must explain its governance.');
assert.match(section, /A submission is confidential, does not imply acceptance/, 'The public register must expose its submission boundary.');
assert.match(section, /Question or challenge a record/, 'The public register must expose a correction route.');
assert.match(section, /"@type": "ItemList"/, 'The register must emit structured data.');
assert.match(section, /"@type": "CreativeWork"/, 'Each record must be represented as a CreativeWork.');
assert.match(section, /datePublished/, 'Structured data must expose publication dates.');
assert.match(section, /dateModified/, 'Structured data must expose review dates.');
assert.doesNotMatch(section, /source_label|source_url/, 'The legacy unscoped source fields must be retired.');

assert.match(css, /\.mer__record:target/, 'Anchored records must have a visible target state.');
assert.match(css, /\.mer__standards summary[\s\S]*min-height:\s*44px/, 'Governance disclosures must meet minimum target size.');
assert.match(css, /summary:focus-visible/, 'Disclosure controls must have a visible keyboard focus state.');

for (const term of ['Working observation', 'Practice hypothesis', 'Product record', 'Under review', 'Retired', 'AI systems cannot be authors', 'does not silently overwrite']) {
  assert.match(policy, new RegExp(term, 'i'), `Editorial policy must define ${term}.`);
}
for (const field of ['number', 'version', 'next_review', 'source_n_scope', 'ai_disclosure', 'change_note']) {
  assert.match(schema, new RegExp(`\\\`${field}\\\``), `Public schema must define ${field}.`);
}

const sourceRows = sources.trim().split('\n');
assert.equal(sourceRows.length, 6, 'The Phase 3 source register must contain five governed sources.');
for (const sourceId of ['SRC-001', 'SRC-002', 'SRC-003', 'SRC-004', 'SRC-005']) assert.match(sources, new RegExp(sourceId));
for (const phrase of ['does_not_support', '10.1037/ocp0000031', '10.1111/joop.12137', '10.1002/job.2217']) assert.match(sources, new RegExp(phrase.replaceAll('.', '\\.')));

for (const item of ['Named accountable author', 'Every material factual claim', 'AI use disclosed', 'Stable record number', 'Structured data validates']) {
  assert.match(checklist, new RegExp(item), `Editorial checklist must include ${item}.`);
}
assert.match(execution, /Phase 3 — citation-ready records and editorial governance/, 'Execution register must record Phase 3.');

console.log('Authority Phase 3 validation passed: three citation-ready records, five governed sources, public editorial standards, correction routes and structured metadata are coherent.');
