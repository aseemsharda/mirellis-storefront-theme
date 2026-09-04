# Mirellis curriculum source of truth

The released application content is generated from `src/content/generated.ts`. Its V3 curriculum dossier, authoring-contract fields, evidence boundary, safety perimeter, and acceptance-test links are declared in `src/curriculum/stewardship.ts`.

Each active transition has a stable `TR-###` dossier. Existing V1/V2 experiences are marked `active-legacy`: they remain available to users, but no semantic, safety, evidence, or route-policy change may be made without a named V3 change request and the required human review.

V3 does not permit runtime content generation, automatic curriculum mutation, or use of aggregate evidence to alter an individual route.
