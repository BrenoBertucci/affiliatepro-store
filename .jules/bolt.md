# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Performance optimization requires a baseline. Without measurements, optimization is just guessing.
**Action:** Always verify the codebase state and potential hotspots before applying changes.

## 2024-05-24 - Server-Side vs Client-Side Filtering
**Learning:** Fetching all records (`getAll()`) just to filter a few on the client is a major anti-pattern that scales poorly (O(n) network/memory vs O(1)). Supabase filters are extremely efficient.
**Action:** Always check if a filter/slice operation can be moved to the Supabase query using `.eq()` and `.limit()`.

## 2024-05-24 - Debouncing Server-Side Search
**Learning:** When moving search to server-side, real-time filtering (on every keystroke) creates excessive API calls. Debouncing is essential for performance and rate limiting.
**Action:** Always wrap server-side search inputs with a `useDebounce` hook (standard 300-500ms delay).
