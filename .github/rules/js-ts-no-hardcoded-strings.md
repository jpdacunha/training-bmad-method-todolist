---
name: JS/TS No Hardcoded Strings
description: Enforces extraction of JavaScript and TypeScript string literals into dedicated constants files with clear ownership and minimal file sprawl.
applyTo: "**/*.{js,jsx,ts,tsx}"
---

# JavaScript and TypeScript: No Hardcoded Strings

Do not introduce hardcoded string literals directly in JavaScript or TypeScript code.

Every string value must be defined as a named constant and imported from a dedicated constants file.

The objective is single-point-of-change string management: updating a string value in one place must propagate to all code paths that depend on it.

Constants files may be split by domain when needed, but each file must have a clear functional role and explicit naming.

Keep the number of constants files as low as possible while preserving clear responsibility boundaries.

Use semantic constant names that express business or technical intent, not raw literal labels.

Constant identifiers must use `UPPER_SNAKE_CASE`.

Non-semantic example: `const google = "google"`.

Semantic example: `const AUTH_METHOD_GOOGLE = "google"`.