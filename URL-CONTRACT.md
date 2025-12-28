# Soustack Specification URL Contract

This document defines the canonical, stable URL contract for the Soustack specification and related artifacts, including schemas, documentation, and conformance artifacts.

## 1. Purpose

A data standard requires stable, unambiguous identifiers for its schemas and documentation. Without a canonical URL contract, implementations diverge, tooling breaks, and interoperability degrades over time.

Soustack treats URLs as part of the public contract. The stability and clarity of these identifiers outweigh convenience or short-term iteration. This document is normative for spec hosting, even if individual tools lag behind temporarily.

## 2. Canonical Hostnames

`https://spec.soustack.org` is the ONLY canonical hostname for the Soustack specification. All vNext schemas, `$id` values, and documentation links must resolve under this host.

Other hostnames may exist for historical or transitional reasons, but are not canonical. Implementations must not treat non-canonical hostnames as authoritative.

## 3. Canonical Machine-Readable URLs

The following URLs are canonical locations for machine-consumable artifacts:

- **Root schema**  
  `https://spec.soustack.org/soustack.schema.json`

- **Definition schemas**  
  `https://spec.soustack.org/defs/<name>.schema.json`

- **Stack schemas**  
  `https://spec.soustack.org/stacks/<stack>.schema.json`

- **Conformance fixtures**  
  `https://spec.soustack.org/fixtures/valid/...`  
  `https://spec.soustack.org/fixtures/invalid/...`

These URLs:
- Must be stable across time
- Must not contain version numbers in the path
- Are suitable for direct use in `$schema` and `$ref`

## 4. Canonical Human-Readable Documentation URLs

All human-facing documentation lives under `/docs`. The following paths are canonical:

- `/docs` — documentation index
- `/docs/spec` — rendered normative specification
- `/docs/profiles` — profile registry and explanations
- `/docs/stacks` — stack index
- `/docs/stacks/<stack>@<major>` — stack-specific documentation
- `/docs/conformance` — validation and fixture guidance
- `/docs/versioning` — versioning and evolution rules
- `/docs/discovery` — recommended (non-normative) discovery patterns

The `/docs` namespace MUST NOT collide with machine-readable schema paths.

## 5. Versioning Strategy

Schema URLs do not embed version numbers. Breaking changes are handled via stack major versions instead. For example, a stack at version `2.0.0` may reference schemas that have evolved, but the schema URLs themselves remain stable.

Historical or deprecated schemas may be hosted under clearly marked legacy paths if needed, but the primary schema URLs remain version-agnostic.

URL stability is a stronger guarantee than implementation parity. A stable URL may reference evolving content, but the URL itself must not change.

## 6. Legacy and Alias URLs

The following namespaces are known to exist but are NOT canonical:

- `soustack.org/schema/...`
- `soustack.ai/schemas/...`
- `soustack.spec/...` (if applicable)

For each of these:
- They are NOT canonical
- They may redirect, mirror, or be deprecated
- New implementations MUST NOT mint new identifiers under these namespaces

## 7. Requirements for Implementations

Tools and libraries must adhere to the following rules:

- New schemas MUST use canonical URLs from this document
- Tools MAY accept legacy URLs for backward compatibility
- Tools MUST emit canonical URLs when generating new artifacts
- CI and conformance tooling SHOULD flag non-canonical URLs

## 8. Change Policy

Changes to this document are rare and high-impact. Any change must preserve backward compatibility where possible. Breaking changes require explicit migration guidance and should be avoided except in exceptional circumstances.

---

This contract exists to ensure long-term interoperability across publishers, consumers, and automated tooling. Stability and clarity of identifiers are foundational to the success of a data standard.

