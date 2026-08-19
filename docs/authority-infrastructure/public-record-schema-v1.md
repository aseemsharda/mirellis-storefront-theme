# Mirellis public record schema v1

Frozen for the Phase 3 development build on 19 August 2026.

## Required fields

| Field | Purpose | Public |
|---|---|---|
| `number` | Stable zero-padded identifier | Yes |
| `territory` | Morning, work or evening territory | Yes |
| `status` | Working observation, Practice hypothesis, Product record, Under review or Retired | Yes |
| `version` | Semantic editorial version | Yes |
| `published` | First publication date | Yes |
| `reviewed` | Most recent substantive review | Yes |
| `next_review` | Review deadline or trigger | Yes |
| `author` | Accountable human or institutional author | Yes |
| `reviewer` | Exact review level and responsible party | Yes |
| `title` | Bounded claim or record title | Yes |
| `statement` | What the record currently says | Yes |
| `evidence_basis` | Why the statement is publishable | Yes |
| `limitation` | What cannot be concluded | Yes |
| `source_n_citation` | Human-readable source | Yes |
| `source_n_url` | Stable source URL or DOI | Yes |
| `source_n_scope` | What the source supports and does not support | Yes |
| `disclosure` | Funding, conflicts and commercial interests | Yes |
| `ai_disclosure` | Material AI use and human accountability | Yes |
| `change_note` | Material update, correction or retirement note | When applicable |
| `practice_url` | Optional related action | When applicable |

## Stable citation

`Mirellis Editorial. “{title}.” Mirellis Observatory, Record {number}, version {version}, reviewed {reviewed}. https://mirellis.in/pages/the-observatory#record-{number}`

Record anchors never move. A retired record keeps the same anchor and displays its status and replacement.

## Structured data

The canonical Observatory page emits an `ItemList` containing one `CreativeWork` per public record. Each item includes its stable URL, headline, version, dates, accountable author, publisher and external citations. This metadata describes a public editorial record, not a clinical study or medical recommendation.
