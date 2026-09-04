# CR-003 — Curriculum stewardship system V3

- Change class: C (interaction) and D (evidence/routing governance)
- Status: Implemented framework; semantic curriculum review remains pending named human approvers.
- Affected objects: TR-001 through TR-007, route-policy evidence inventory, settings information architecture.

## Problem

The app had versioned transition content and a local route policy, but no repository-level curriculum dossier or enforceable authoring-contract inventory.

## Proposed diff

Add stable transition dossiers, machine-readable learning claim and capability fields, explicit permitted evidence, safety perimeter, acceptance-test identifiers, integrity checks, and a user-visible curriculum record. Do not change any learning claim, route weight, safety route, or source copy.

## Hypothesis

Making curriculum provenance and constraints explicit will make future changes easier to review and reverse without changing the current user experience semantically.

## Risk and controls

Risk: treating this governance framework as a substitute for qualified human review. Control: all imported experiences remain `active-legacy` and are explicitly blocked from semantic change until named review is recorded.

## Evaluation

Run curriculum schema, route-policy, accessibility, privacy, and regression tests. Confirm that no free text or aggregate evidence enters personal routing.

## Approvals

Product-owner implementation request received. Named curriculum, editorial, privacy, and qualified safety approvals are required before any semantic, safety, evidence, or routing change to an experience.

## Rollback

Revert the V3 metadata and curriculum-record surface; existing generated transition content and local route data remain intact.
