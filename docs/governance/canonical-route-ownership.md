# Mirellis canonical route ownership

Status: release rule · 22 August 2026

This register prevents the same public page from being maintained in more than one codebase.

| Public territory | Canonical URL | Owning source | Notes |
| --- | --- | --- | --- |
| Brand homepage | `https://mirellis.in/` | Shopify theme | Public discovery, pathways and commerce context. |
| Sleep, focus and restoration gateways | `https://mirellis.in/sleep`, `/focus`, `/restoration` | Shopify theme | Problem-first entry; no diagnosis. |
| Journal and public Observatory | `https://mirellis.in/blogs/journal`, `/pages/the-observatory` | Shopify theme | Editorial authority and governed public records. |
| About, Why We Exist, How We Work, Understand | `https://mirellis.in/pages/...` | `mirellis-directory` | Cloudflare routes these main-domain paths to the directory deployment. Do not edit duplicate Shopify page templates as the live source. |
| Specialist directory | `https://directory.mirellis.in/` | `mirellis-directory` | Listings, practitioners, concern navigator and professional routes. |
| Concern pages | `https://directory.mirellis.in/problems/...` | `mirellis-directory` | Publication is governed by the clinical-content gate. |
| Private companion | `https://app.mirellis.in/` | `mirellis-app` | Local-first private practice; analytics remain inactive. |
| Contributor studio | Studio Vercel project | `mirellis-studio` | Submission and approval workflow; not part of the public discovery route. |

## Navigation contract

The public header order is: Get help → Learn → Mirellis app → Shop → About.

- **Get help** groups Start a check-in, Explore concerns, Find a specialist, and Retreats & programmes.
- **Learn** groups Articles, Observatory findings, and Understand.
- **About** groups About Mirellis, How Mirellis works, and For professionals.
- The Mirellis wordmark is the Home control; a duplicate Start here link is not required.
- Desktop groups are click disclosures with Escape and outside-click closure. Mobile presents the same destinations as labelled groups rather than hiding them behind nested menus.

Products are optional instruments. They do not appear as treatment inside a distress, concern, specialist-verification or clinical-trust moment.

## Release rule

Before any deployment, verify the public URL against this table, edit only the owning source, preserve aliases with redirects, and retain the previous Shopify theme or Vercel deployment as rollback.
