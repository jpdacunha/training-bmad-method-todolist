---
name: No Deprecated or Incompatible APIs
description: Prohibits the use of deprecated APIs and combinations of APIs that are known to be incompatible.
alwaysApply: true
---

# No Deprecated or Incompatible APIs

Do not introduce or use deprecated APIs in application code, tests, scripts, or configuration.

Do not combine APIs, libraries, or framework features that are documented as incompatible with each other.

Before implementation, verify compatibility against official documentation for versions used in this workspace.

If no compatible alternative is identified, stop and request clarification instead of guessing or forcing a workaround.