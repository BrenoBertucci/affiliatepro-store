# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Performance optimization requires a baseline. Without measurements, optimization is just guessing.
**Action:** Always verify the codebase state and potential hotspots before applying changes.

## 2025-05-22 - Large Admin Bundle Impact
**Learning:** The Admin module accounts for nearly 45% of the total application code size (345kB vs 451kB core). Eager loading it penalizes all users significantly.
**Action:** Ensure administrative or authenticated-only routes are always code-split in this architecture.
