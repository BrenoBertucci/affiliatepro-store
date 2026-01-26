# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Performance optimization requires a baseline. Without measurements, optimization is just guessing.
**Action:** Always verify the codebase state and potential hotspots before applying changes.

## 2024-05-24 - Server-Side vs Client-Side Filtering
**Learning:** Fetching all records (`getAll()`) just to filter a few on the client is a major anti-pattern that scales poorly (O(n) network/memory vs O(1)). Supabase filters are extremely efficient.
**Action:** Always check if a filter/slice operation can be moved to the Supabase query using `.eq()` and `.limit()`.

## 2024-05-25 - Supabase Text Search
**Learning:** Supabase's `.or()` method for full-text search requires careful string formatting (e.g., handling commas) to avoid syntax errors.
**Action:** When implementing search, sanitize input and format the `.or()` string correctly (e.g., `col1.ilike.%val%,col2.ilike.%val%`).
