# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Performance optimization requires a baseline. Without measurements, optimization is just guessing.
**Action:** Always verify the codebase state and potential hotspots before applying changes.

## 2024-05-24 - Server-Side vs Client-Side Filtering
**Learning:** Fetching all records (`getAll()`) just to filter a few on the client is a major anti-pattern that scales poorly (O(n) network/memory vs O(1)). Supabase filters are extremely efficient.
**Action:** Always check if a filter/slice operation can be moved to the Supabase query using `.eq()` and `.limit()`.

## 2025-02-05 - Search Debouncing & Multi-field Filtering
**Learning:** When moving search to the server, debouncing is mandatory to prevent API thrashing. Supabase `.or()` syntax with `ilike` is powerful for multi-field search (e.g. `name.ilike.%q%,description.ilike.%q%`) but requires careful string construction.
**Action:** Always pair server-side search with a debounce hook (e.g., 500ms) and sanitization of search terms.
