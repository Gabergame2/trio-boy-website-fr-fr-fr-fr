---
name: Artifact workflow rebuilds
description: How managed API artifact workflows pick up server source changes.
---

Managed API artifact workflows start from a built bundle rather than watching server source files.

**Why:** A source edit can pass typechecking and a manual build while the already-running workflow continues serving the previous bundle.

**How to apply:** After API/server code, dependency, or environment changes, rebuild and restart the exact managed API workflow before smoke-testing routes.