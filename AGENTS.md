# AGENTS.md — spec.soustack.org

This repository hosts **spec.soustack.org**, the canonical public site for the Soustack specification.

It is **not** the specification itself.
It is the **authoritative host** for canonical URLs, schemas, fixtures, and rendered documentation.

AI agents, automation, and contributors must follow the rules below strictly.

---

## 1. Repository Role

This repo is responsible for:

- Serving **canonical, stable URLs** for:
  - Root schema
  - Definition schemas
  - Stack schemas
  - Conformance fixtures
- Rendering **human-readable documentation** derived from `soustack-spec`
- Enforcing the **URL contract** published at `/URL-CONTRACT.md`
- Preventing **contract drift** across the Soustack ecosystem

This repo is **read-only with respect to the specification’s meaning**.

All normative content originates in the `soustack-spec` repository.

---

## 2. Canonical URL Authority

This repository defines and enforces the canonical host:

https://spec.soustack.org

All of the following are considered **contractually authoritative** when served from this repo:

- /soustack.schema.json
- /defs/*
- /stacks/*
- /fixtures/valid/*
- /fixtures/invalid/*
- /URL-CONTRACT.md

AI agents MUST NOT introduce:
- Versioned schema URLs
- Alternate canonical hosts
- New schema identifiers

If a change affects schema meaning, it belongs in **soustack-spec**, not here.

---

## 3. Two-Zone Architecture (DO NOT BREAK)

This repo intentionally separates concerns:

### Machine-readable artifacts (verbatim)

/public/*

- Served exactly as copied
- No routing logic
- No transforms
- No rewriting
- Suitable for `$schema` and `$ref`

### Human-readable documentation

/src/pages/docs/*

- Generated or rendered content
- Safe to change presentation
- MUST NOT redefine schema semantics

AI agents must **never mix these zones**.

---

## 4. Source of Truth

All schemas, fixtures, registries, and normative prose come from:

https://github.com/richardherold/soustack-spec

This repo consumes that source via:

- scripts/sync-spec.mjs
- scripts/generate-docs.mjs

AI agents must:
- Treat `soustack-spec` as authoritative
- Avoid duplicating or reinterpreting spec logic
- Avoid hand-editing synced artifacts

---

## 5. Allowed Changes

AI agents MAY:

- Improve build scripts (`sync-spec`, `generate-docs`, `assert-artifacts`)
- Improve documentation rendering and layout
- Improve debug/inspection pages
- Improve CI guardrails that enforce artifact presence
- Fix bugs that cause the site to misrepresent the spec

AI agents MAY NOT:

- Change schema structure or semantics
- Invent new stacks, profiles, or rules
- Modify copied schemas or fixtures directly
- Introduce alternate canonical URLs
- Add server-side runtime behavior

---

## 6. Build & Validation Invariants

The following invariants must always hold:

- `npm run build` fails if canonical artifacts are missing
- `/soustack.schema.json` exists and is reachable
- `/stacks/registry.json` exists and matches the spec repo
- `/fixtures/valid` and `/fixtures/invalid` are non-empty
- `/URL-CONTRACT.md` is publicly served

Breaking these invariants is considered a **contract violation**.

---

## 7. Versioning Philosophy

- Schema URLs are **version-agnostic**
- Breaking changes are expressed via **stack major versions**
- Docs may evolve; URLs must not
- Legacy namespaces may be accepted but are never emitted

If an AI agent is unsure how to version something:
Do **not** version it here.

---

## 8. Relationship to Other Repositories

soustack-spec — writes the specification (normative)
spec.soustack.org — hosts the specification (canonical URLs)
soustack-core — enforces the spec
soustack-ingest — produces spec-conforming artifacts
soustack-blocks — consumes spec artifacts
MCP repos — expose spec behavior to agents

This repo sits at the **center of trust**, not execution.

---

## 9. Guiding Principle

If this site is wrong, the ecosystem fragments.

Stability, clarity, and correctness take precedence over convenience, polish, or speed.

When in doubt:
- Prefer **not changing behavior**
- Prefer **failing the build**
- Prefer **deferring changes to soustack-spec**

End of AGENTS.md
