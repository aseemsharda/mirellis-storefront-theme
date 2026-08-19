#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(file, 'utf8');
const [contactTemplate, contactSection, schema, homepage, homepageCss, overrides, header, footer] = await Promise.all([
  read('templates/page.contact.json'),
  read('sections/contact.liquid'),
  read('snippets/microdata-schema.liquid'),
  read('sections/mirellis-problem-home.liquid'),
  read('assets/mirellis-problem-home.css'),
  read('assets/mirellis-impact-overrides.css'),
  read('sections/header.liquid'),
  read('sections/footer.liquid'),
]);

assert.doesNotMatch(contactTemplate, /<strong>lambdalifestyle/i, 'The public contact page must lead with Mirellis.');
assert.doesNotMatch(contactTemplate, /DLF Sky Court|Apartment:/i, 'The public contact page must not expose a private residential address.');
assert.match(contactTemplate, /Lambda Lifestyle Private Limited/, 'The legal operator must remain transparent.');
assert.match(contactSection, /<h1 class="h2">/, 'The contact page must expose a level-one heading.');

assert.match(schema, /"name": "Mirellis"/, 'Organization and WebSite schema must use the current public name.');
assert.match(schema, /"legalName": "Lambda Lifestyle Private Limited"/, 'Organization schema must name the legal operator.');
assert.match(schema, /sleep, focus and restoration/i, 'Organization schema must describe the current public scope.');
assert.doesNotMatch(schema, /shop\.brand\.short_description|shop\.brand\.slogan|shop\.brand\.metafields\.social_links/, 'Schema must not inherit stale Shopify brand copy or social links.');
assert.doesNotMatch(schema, /shop\.brand\.logo/, 'Organization schema must not inherit the legacy Lambda logo.');
assert.match(schema, /potential_action_target = shop\.url/, 'Search schema must use the canonical shop domain.');
assert.match(schema, /mirellis_social_url \| split: '\?'/, 'Social profile schema must remove tracking query parameters.');
assert.match(schema, /"name": \{\{ article\.title \| json \}\}/, 'Article breadcrumbs must use the article title.');

assert.match(homepage, /Open the Mirellis app/, 'The homepage must name the multi-moment app accurately.');
assert.doesNotMatch(homepage, /<script type="application\/ld\+json">/, 'The homepage section must not duplicate global Organization schema.');
assert.match(homepageCss, /font-size: clamp\(2\.35rem, 5\.4vw, 4\.85rem\)/, 'The homepage headline must use the corrected responsive scale.');
assert.match(overrides, /HEADER FIT/, 'The theme must include the mid-width header fit correction.');
assert.doesNotMatch(header, /request\.page_type == 'index'[\s\S]{0,180}<h1 class="header__logo">/, 'The homepage must not contain a second level-one heading around the logo.');
assert.match(footer, /assign footer_link_title = 'Mirellis app'/, 'The legacy After Work footer label must be corrected at render time.');

console.log('Authority Phase 1 validation passed: contact identity, global schema, app naming, heading hierarchy, homepage scale and header-fit safeguards are present.');
