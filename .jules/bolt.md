# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Performance optimization requires a baseline. Without measurements, optimization is just guessing.
**Action:** Always verify the codebase state and potential hotspots before applying changes.

## 2024-05-24 - Server-Side vs Client-Side Filtering
**Learning:** Fetching all records (`getAll()`) just to filter a few on the client is a major anti-pattern that scales poorly (O(n) network/memory vs O(1)). Supabase filters are extremely efficient.
**Action:** Always check if a filter/slice operation can be moved to the Supabase query using `.eq()` and `.limit()`.

## 2024-05-24 - Race Conditions in Async Effects
**Learning:** When using debounced filters with async Supabase calls, race conditions can occur where a stale request overrides a newer one.
**Action:** Always use the `ignore` flag pattern in `useEffect` cleanups when handling async data fetching that depends on rapidly changing state (like search/filters).
