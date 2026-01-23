# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Performance optimization requires a baseline. Without measurements, optimization is just guessing.
**Action:** Always verify the codebase state and potential hotspots before applying changes.

## 2024-05-24 - Server-Side vs Client-Side Filtering
**Learning:** Fetching all records (`getAll()`) just to filter a few on the client is a major anti-pattern that scales poorly (O(n) network/memory vs O(1)). Supabase filters are extremely efficient.
**Action:** Always check if a filter/slice operation can be moved to the Supabase query using `.eq()` and `.limit()`.

## 2025-05-27 - Server-Side Filtering & Debouncing
**Learning:** When moving filtering from client-side to server-side, immediate UI feedback (controlled inputs) MUST be decoupled from the data fetching using debouncing. Without it, every keystroke triggers a network request, causing race conditions and rate limiting.
**Action:** Use a `useDebounce` hook for filter inputs (search, range sliders) when they trigger backend queries.
