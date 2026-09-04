#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const valueFor = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const sitemapFile = valueFor('--sitemap-file', 'deliverables/launch-readiness-audit-2026-08-13/sitemap-blogs.xml');
const outDir = valueFor('--out-dir', 'docs/governance/generated');
const concurrency = Math.max(1, Math.min(8, Number(valueFor('--concurrency', '4')) || 4));
const metadataOnly = args.includes('--metadata-only');

const rules = [
  { id: 'clinical-proof', severity: 'critical', pattern: /\b(clinically proven|clinical studies? (?:show|prove)|controlled clinical studies?|scientifically proven)\b/i },
  { id: 'treatment-or-cure', severity: 'critical', pattern: /\b(cures?|treats?|heals?|prevents?|reverses?)\b.{0,50}\b(condition|disease|disorder|anxiety|depression|insomnia)\b/i },
  { id: 'guaranteed-outcome', severity: 'critical', pattern: /\b(guaranteed?|will (?:improve|reduce|restore|regulate|transform)|transform your (?:sleep|health|life))\b/i },
  { id: 'quantified-outcome', severity: 'critical', pattern: /\b\d{1,3}%\b.{0,80}\b(improv|reduc|increase|decrease|better|calm|sleep|stress)\w*/i },
  { id: 'sleep-outcome', severity: 'high', pattern: /\b(deep sleep|restorative sleep|sleep quality|fall asleep|sleep better|sleep aid)\b/i },
  { id: 'stress-outcome', severity: 'high', pattern: /\b(stress relief|reduce stress|reduces? cortisol|calms? the body|calms? the nervous system)\b/i },
  { id: 'physiology-mechanism', severity: 'high', pattern: /\b(nervous system|parasympathetic|cortisol|dopamine|circadian|oral[- ]gut[- ]brain|downregulation|regulation)\b/i },
  { id: 'health-benefit', severity: 'high', pattern: /\b(promotes?|supports?|improves?|boosts?)\b.{0,55}\b(health|wellness|immunity|digestion|memory|focus|oral health|well-being)\b/i },
  { id: 'medical-authority', severity: 'high', pattern: /\b(research (?:shows|proves)|science (?:shows|proves)|doctors? recommend|evidence proves)\b/i },
  { id: 'absolute-mechanism', severity: 'medium', pattern: /\b(?:the )?(?:brain|body|nervous system|hormones?) (?:needs?|requires?|responds?|learns?|reads?)\b/i },
];

const severityRank = { clear: 0, medium: 1, high: 2, critical: 3 };

const decode = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)));

const plainText = (html) => decode(html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim());

const extract = (html, pattern) => decode(html.match(pattern)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ?? '');

const excerptFor = (text, pattern) => {
  const match = pattern.exec(text);
  if (!match || match.index === undefined) return '';
  const start = Math.max(0, match.index - 90);
  const end = Math.min(text.length, match.index + match[0].length + 130);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
};

const sitemap = await readFile(sitemapFile, 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((match) => decode(match[1]))
  .filter((url) => /\/blogs\/[^/]+\/[^/?#]+/.test(url));

const scanUrl = async (url) => {
  if (metadataOnly) {
    const slug = decodeURIComponent(new URL(url).pathname.split('/').pop() ?? '').replaceAll('-', ' ');
    const flags = rules
      .filter((rule) => rule.pattern.test(slug))
      .map((rule) => ({ id: rule.id, severity: rule.severity, excerpt: `Title/URL triage only: ${slug}` }));
    const severity = flags.reduce((current, flag) => severityRank[flag.severity] > severityRank[current] ? flag.severity : current, 'clear');
    return { url, status: 'not-fetched', title: slug, description: '', severity, action: severity === 'critical' ? 'unpublish-or-noindex-until-reviewed' : severity === 'high' ? 'editorial-and-evidence-review' : severity === 'medium' ? 'copy-review' : 'manual-review-required', flags };
  }
  try {
    const response = await fetch(url, { headers: { 'user-agent': 'Mirellis-Public-Claim-Audit/1.0 (+https://mirellis.in)' }, redirect: 'follow' });
    const html = await response.text();
    const title = extract(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = extract(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i)
      || extract(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i);
    const text = plainText(html);
    const flags = rules
      .filter((rule) => rule.pattern.test(`${title} ${description} ${text}`))
      .map((rule) => ({ id: rule.id, severity: rule.severity, excerpt: excerptFor(text, rule.pattern) }));
    const severity = flags.reduce((current, flag) => severityRank[flag.severity] > severityRank[current] ? flag.severity : current, 'clear');
    return { url, status: response.status, title, description, severity, action: severity === 'critical' ? 'unpublish-or-noindex-until-reviewed' : severity === 'high' ? 'editorial-and-evidence-review' : severity === 'medium' ? 'copy-review' : 'retain', flags };
  } catch (error) {
    return { url, status: 0, title: '', description: '', severity: 'critical', action: 'fetch-failed-manual-review', flags: [{ id: 'fetch-failed', severity: 'critical', excerpt: String(error) }] };
  }
};

const results = new Array(urls.length);
let nextIndex = 0;
const worker = async () => {
  while (nextIndex < urls.length) {
    const index = nextIndex++;
    results[index] = await scanUrl(urls[index]);
  }
};
await Promise.all(Array.from({ length: concurrency }, worker));

const summary = results.reduce((totals, item) => {
  totals[item.severity] += 1;
  return totals;
}, { clear: 0, medium: 0, high: 0, critical: 0 });

const quoteCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const csv = [
  ['URL', 'HTTP status', 'Title', 'Risk', 'Required action', 'Flags', 'Evidence excerpt'].map(quoteCsv).join(','),
  ...results.map((item) => [
    item.url,
    item.status,
    item.title,
    item.severity,
    item.action,
    item.flags.map((flag) => flag.id).join('|'),
    item.flags.map((flag) => flag.excerpt).filter(Boolean).join(' | '),
  ].map(quoteCsv).join(',')),
].join('\n');

const report = `# Public claim scan\n\nGenerated: ${new Date().toISOString()}  \nSource sitemap: \`${sitemapFile}\`  \nMode: ${metadataOnly ? 'title and URL metadata only' : 'public page text'}  \nArticles scanned: ${results.length}\n\n| Risk | Count |\n| --- | ---: |\n| Critical | ${summary.critical} |\n| High | ${summary.high} |\n| Medium | ${summary.medium} |\n| Clear by automated scan | ${summary.clear} |\n\nThis is a triage instrument, not an evidence review. A clear automated result does not certify a claim. ${metadataOnly ? 'Metadata-only mode cannot clear article body copy; every record still requires human review.' : 'Critical and high records require a human editorial and source review before launch.'} The scanner stores only short public-page excerpts and never reads application or customer data.\n`;

await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, 'public-claim-scan.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), sitemapFile, metadataOnly, summary, results }, null, 2)}\n`);
await writeFile(path.join(outDir, 'public-claim-register.csv'), `${csv}\n`);
await writeFile(path.join(outDir, 'public-claim-scan.md'), report);

console.log(JSON.stringify({ articles: results.length, summary, outDir }, null, 2));
