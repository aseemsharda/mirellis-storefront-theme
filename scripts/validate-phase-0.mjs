#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(file, 'utf8');
const [layout, governance, redirects, measurement, homepage, workday, register, product, releaseRecord, claimScan] = await Promise.all([
  read('layout/theme.liquid'),
  read('snippets/mirellis-public-governance.liquid'),
  read('docs/governance/url-redirects-phase-0.csv'),
  read('docs/governance/measurement-contract-v1.md'),
  read('sections/mirellis-institution-homepage.liquid'),
  read('sections/mirellis-workday-exit.liquid'),
  read('sections/mirellis-evidence-register.liquid'),
  read('sections/mirellis-pdp-decision.liquid'),
  read('mirellis-app/src/operations/release-record.ts'),
  read('docs/governance/generated/public-claim-scan.json'),
]);

assert.match(layout, /render 'mirellis-public-governance'/, 'Theme must render the canonical/noindex safeguard.');
assert.doesNotMatch(layout, /<link rel="canonical" href="\{\{ canonical_url \}\}">/, 'Theme must not render a second default canonical link.');
assert.match(layout, /analyticsProcessingAllowed/, 'Website analytics must remain behind Shopify consent.');
assert.match(layout, /newsletter_submit/, 'Newsletter submission must be represented in the event contract.');

const redirectLines = redirects.trim().split('\n').slice(1);
const redirectSources = redirectLines.map((line) => line.split(',')[0]);
assert.ok(redirectLines.length >= 25, 'The Phase 0 redirect register must cover the known duplicate surface.');
assert.equal(new Set(redirectSources).size, redirectSources.length, 'Redirect sources must be unique.');
assert.ok(redirectSources.every((source) => source.startsWith('/')), 'Redirect sources must be Shopify-relative paths.');
assert.ok(redirectLines.every((line) => line.endsWith(',proposed')), 'Every redirect must remain proposed until live approval.');

const requiredEvents = [
  'today_problem_selected', 'today_action', 'today_resource', 'after_work_problem_selected',
  'after_work_action', 'after_work_programme_open', 'after_work_sound', 'after_work_resource',
  'evidence_register_view', 'evidence_record_open', 'evidence_practice_open',
  'product_decision_view', 'product_add_to_cart', 'newsletter_submit',
];
for (const event of requiredEvents) assert.match(measurement, new RegExp(`\\b${event}\\b`), `Measurement contract must define ${event}.`);
for (const event of ['today_problem_selected', 'today_action', 'today_resource']) assert.match(homepage, new RegExp(`data-mirellis-event="${event}"`));
for (const event of ['after_work_problem_selected', 'after_work_action', 'after_work_programme_open', 'after_work_resource']) assert.match(workday, new RegExp(`data-mirellis-event="${event}"`));
for (const event of ['evidence_register_view', 'evidence_record_open', 'evidence_practice_open']) assert.match(register, new RegExp(`${event}`));
for (const event of ['product_decision_view', 'product_add_to_cart']) assert.match(product, new RegExp(`${event}`));

assert.doesNotMatch(`${layout}${homepage}${workday}${register}${product}`, /contact\[email\].{0,120}mirellis_context/s, 'Email values must never enter Mirellis event context.');
assert.match(measurement, /No cross-domain user ID/, 'The event contract must forbid a cross-domain user identifier.');
assert.match(releaseRecord, /status: releaseEvidence\.every/, 'Certification must be derived from evidence rather than a manual true flag.');
assert.match(releaseRecord, /human-accessibility-review', status: 'pending'/, 'Human accessibility must remain pending until recorded.');
assert.match(releaseRecord, /qualitative-pilot', status: 'pending'/, 'The qualitative pilot must remain pending until conducted.');

const scan = JSON.parse(claimScan);
assert.equal(scan.results.length, 65, 'The current public article inventory must be fully represented in the claim register.');
assert.equal(scan.metadataOnly, true, 'A metadata-only scan must not be misrepresented as a page-body review.');
assert.match(governance, /noindex,follow/, 'The reversible development safeguard must use noindex,follow.');

console.log(`Phase 0 governance validation passed: ${redirectLines.length} proposed redirects, ${scan.results.length} claim records, ${requiredEvents.length} governed website events.`);
