# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Performance optimization requires a baseline. Without measurements, optimization is just guessing.
**Action:** Always verify the codebase state and potential hotspots before applying changes.

## 2024-05-24 - Server-Side vs Client-Side Filtering
**Learning:** Fetching all records (`getAll()`) just to filter a few on the client is a major anti-pattern that scales poorly (O(n) network/memory vs O(1)). Supabase filters are extremely efficient.
**Action:** Always check if a filter/slice operation can be moved to the Supabase query using `.eq()` and `.limit()`.

## 2024-05-24 - Debounce Pattern for Server Requests
**Learning:** When moving filtering to the server, inputs like search bars and range sliders can trigger excessive API calls (429 errors or lag).
**Action:** Always implement `useDebounce` for inputs that trigger server-side queries.
