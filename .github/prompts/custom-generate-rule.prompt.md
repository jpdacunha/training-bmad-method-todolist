---
name: Custom Generate Rule
description: Authoring, structure, and compliance guidelines for rule files used by GitHub tooling and GitHub Copilot.
---

# GitHub Copilot – Rule Generation Specification

This document defines the required structure, authoring conventions, storage locations, and behavioral expectations for all rule files used by GitHub Copilot or other GitHub-integrated automation. Any generated or modified rule must fully comply with the specifications below.

## 1. Storage and File Format Requirements

- All rule files must be stored inside the `.github` directory.
- Rule files must use the `.md` extension.
- Rules must be authored in pure Markdown. Workspace-specific extensions are allowed if supported by the tooling.
- When referencing another file, use the format:  
  `md:filename.ext`  
  Paths must always be relative to the workspace root.

## 2. YAML Frontmatter Specification

Each rule file must begin with a valid YAML frontmatter block.  
The following properties are supported:

- **name** (string): Optional display name of the rule.  
- **description** (string): Used by tools and agents to interpret the rule.  
- **alwaysApply** (boolean): If true, the rule applies globally to all requests.  
- **applyTo** (string): Comma-separated list of gitignore-style patterns that define file-scoped applicability.  

### YAML Requirements  
- Must be valid, properly indented YAML.  
- No trailing spaces.  
- Both `applyTo` and `description` may be specified together.  
- The frontmatter block must appear at the very top of the file.

## 3. Purpose and Usage

Rules guide GitHub Copilot and other automation systems to:

- understand project conventions,  
- apply coding standards,  
- interpret codebase architecture,  
- enforce authoring expectations consistently.

Critical rules should be summarized or linked from `.github/copilot-instructions.md` to improve Copilot ingestion.

## 4. Workspace‑Specific Architectural Constraints

When defining frontend architecture or style rules, the workspace enforces:

- **Co-location of component styles and their TSX component files**  
  (same folder, same base name).

Example:  
`Component.tsx` → `Component.module.css` or equivalent.

## 5. Language and Consistency Requirements (Non-Overridable)

All rule files must be authored exclusively in English.

- Files in `.github/rules/*.md` must always be written and maintained in English.  
- If a user request is written in another language, the generated rule must still be in English.  
- Never mix English and non-English text within the same rule file.  
- If an existing rule contains non-English content, it must be translated to English during the next update.

## 6. Writing Principles

All rules must follow these principles:

- **Concise** — No unnecessary text.  
- **Unambiguous** — Avoid vague verbs or unclear constraints.  
- **Single-responsibility** — One conceptual rule per file.  
- **Deterministic** — Do not rely on implicit assumptions.  
- **Consistent** — Use stable, uniform terminology.

### ⬆️ **New requirement: Mandatory clarification request**
If a user does not provide the actual content of the rule (for example, missing constraints, missing style guidelines, missing behavioral definition), the system **must request clarification** before generating or updating the rule file.  
Under no circumstance should the tool “guess” the rule’s meaning or invent missing parts.

Example triggers that require clarification:
- vague requests like “create a rule about coding style”  
- missing constraints (“define architecture guidelines” with no detail)  
- unclear applicability (“make a TypeScript rule” with no specifics)

The rule generation process must explicitly ask the user to provide the missing information.

## 7. Examples

### Example 1 — Always-applied project structure rule

```md
---
alwaysApply: true
description: Defines the main project structure and key entry points.
---

This rule describes the project's directory layout and how code should be organized.
``