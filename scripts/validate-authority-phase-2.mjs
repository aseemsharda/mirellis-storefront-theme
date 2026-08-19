#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(file, 'utf8');
const parseShopifyJson = (source) => JSON.parse(source.replace(/^\/\*[\s\S]*?\*\/\s*/, ''));

const [navigation, header, headerGroupSource, navigationPanel, footer, problemHome, contact, contactSection, observatorySource, assignedObservatorySource, observatoryLanding, register, governance, redirects, routeMap, decisionRegister, architecture, overrides] = await Promise.all([
  read('snippets/mirellis-public-navigation.liquid'),
  read('sections/header.liquid'),
  read('sections/header-group.json'),
  read('snippets/navigation-panel.liquid'),
  read('sections/footer.liquid'),
  read('sections/mirellis-problem-home.liquid'),
  read('templates/page.contact.json'),
  read('sections/contact.liquid'),
  read('templates/page.the-observatory.json'),
  read('templates/page.observatory-hub.json'),
  read('sections/observatory-landing.liquid'),
  read('sections/mirellis-evidence-register.liquid'),
  read('snippets/mirellis-public-governance.liquid'),
  read('docs/governance/url-redirects-phase-0.csv'),
  read('docs/authority-infrastructure/public-route-map-v2.csv'),
  read('docs/authority-infrastructure/route-decision-register-v2.csv'),
  read('docs/mirellis-public-architecture-v1.md'),
  read('assets/mirellis-impact-overrides.css'),
]);

for (const label of ['Start here', 'Observatory', 'Get help', 'Contribute', 'About', 'Rituals']) {
  assert.match(navigation, new RegExp(`\\b${label}\\b`), `Public navigation must include ${label}.`);
}
for (const url of ['/', '/pages/the-observatory', '/pages/what-is-going-on', '/pages/contact#contribute', '/pages/about', '/pages/transitions']) {
  assert.ok(navigation.includes(url), `Public navigation must include ${url}.`);
}
assert.doesNotMatch(navigation, />Sleep<|>Focus<|>Restoration</, 'Problem doors must not occupy the institutional navigation.');
assert.match(header, /render 'mirellis-public-navigation'/, 'Desktop header must render the canonical navigation.');
assert.match(navigationPanel, /render 'mirellis-public-navigation'/, 'Mobile drawer must render the canonical navigation.');
assert.match(footer, /render 'mirellis-public-navigation', surface: 'footer'/, 'Explore footer must use the same canonical source.');
assert.equal(parseShopifyJson(headerGroupSource).sections.header.settings.use_problem_navigation, true, 'Source-controlled public navigation must be enabled.');
assert.match(problemHome, /href="\/pages\/what-is-going-on"/, 'Homepage uncertainty route must use the canonical help URL.');
assert.match(header, /<span class="sr-only">Shop account<\/span>/, 'The storefront account control must describe the actual destination.');
assert.doesNotMatch(header, /header\.general\.login/, 'The public header must not expose the ambiguous Login label.');

const contactTemplate = parseShopifyJson(contact);
assert.ok(contactTemplate.sections.contact.blocks.inquiry_type, 'Contact gateway must collect a bounded inquiry type.');
assert.match(contact, /Expert Commentary and Evidence Note/, 'Contribution gateway must name the two launch formats.');
assert.match(contact, /Nothing submitted is published automatically/, 'Contribution gateway must state the publication boundary.');
assert.match(contactSection, /id="contribute"/, 'Contribution gateway must expose a stable anchor.');

const observatoryTemplate = parseShopifyJson(observatorySource);
const assignedObservatoryTemplate = parseShopifyJson(assignedObservatorySource);
assert.deepEqual(observatoryTemplate.order, ['observatory_landing', 'evidence_register'], 'Canonical Observatory must contain one orientation followed by one register.');
assert.deepEqual(assignedObservatoryTemplate.order, ['observatory_landing', 'evidence_register'], 'The template assigned to the live Observatory page must use the canonical two-part architecture.');
assert.equal(observatoryTemplate.sections.observatory_landing.settings.show_articles, false, 'Duplicate article architecture must be suppressed.');
assert.equal(observatoryTemplate.sections.observatory_landing.settings.show_subscribe, false, 'Duplicate subscription architecture must be suppressed.');
assert.equal(assignedObservatoryTemplate.sections.observatory_landing.settings.show_articles, false, 'Assigned Observatory template must suppress duplicate articles.');
assert.equal(assignedObservatoryTemplate.sections.observatory_landing.settings.show_subscribe, false, 'Assigned Observatory template must suppress duplicate subscription.');
assert.match(observatoryLanding, /section\.settings\.show_articles/, 'Observatory article visibility must be explicit.');
assert.match(observatoryLanding, /section\.settings\.show_subscribe/, 'Observatory subscription visibility must be explicit.');
assert.match(register, /<h2 class="mer__heading"/, 'Evidence register must follow the page h1 with a level-two heading.');
assert.doesNotMatch(register, /<h1 class="mer__heading"/, 'Evidence register must not create a second page h1.');
assert.match(overrides, /\.header \.tap-area[\s\S]*min-width:[\s\S]*44px[\s\S]*min-height:[\s\S]*44px/, 'Header controls must expose 44px minimum targets.');
assert.match(overrides, /#header-sidebar-menu a\.group\.block\.w-full[\s\S]*min-height:[\s\S]*44px/, 'Mobile navigation links must expose 44px minimum targets.');
assert.match(overrides, /#header-sidebar-menu a:focus-visible[\s\S]*outline:[\s\S]*2px solid currentColor/, 'Public navigation must expose a visible keyboard focus state.');

for (const handle of ['observatory', 'community', 'community-hub']) assert.match(governance, new RegExp(`['\"]?${handle}`));
const redirectRows = redirects.trim().split('\n').slice(1);
assert.equal(redirectRows.length, 40, 'Phase 2 must govern all 40 reviewed duplicate routes.');
assert.equal(new Set(redirectRows.map((row) => row.split(',')[0])).size, redirectRows.length, 'Redirect sources must be unique.');

const routeRows = routeMap.trim().split('\n').slice(1);
assert.equal(routeRows.filter((row) => row.startsWith('primary,')).length, 5, 'Route map must define five primary navigation destinations.');
assert.equal(routeRows.filter((row) => row.startsWith('secondary,Rituals,')).length, 1, 'Rituals must remain one subordinate navigation destination.');
assert.match(routeMap, /studio\.mirellis\.in[^\n]*phase-4-not-published/, 'Contributor studio must remain explicitly unpublished.');
assert.ok(decisionRegister.trim().split('\n').slice(1).every((row) => row.endsWith(',development-approved')), 'Every Phase 2 redirect decision must remain development-only.');

for (const term of ['Visitor problem doors', 'Observatory territories', 'App moments', 'Editorial contribution and anonymous observation are separate systems']) {
  assert.match(architecture, new RegExp(term), `Architecture document must define ${term}.`);
}

console.log('Authority Phase 2 validation passed: canonical navigation, contribution gateway, Observatory consolidation and 40 development-only redirect decisions are coherent.');
