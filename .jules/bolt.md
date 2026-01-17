# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Performance optimization requires a baseline. Without measurements, optimization is just guessing.
**Action:** Always verify the codebase state and potential hotspots before applying changes.

## 2024-05-24 - Server-Side vs Client-Side Filtering
**Learning:** Fetching all records (`getAll()`) just to filter a few on the client is a major anti-pattern that scales poorly (O(n) network/memory vs O(1)). Supabase filters are extremely efficient.
**Action:** Always check if a filter/slice operation can be moved to the Supabase query using `.eq()` and `.limit()`.

## 2024-05-25 - Supabase Search Syntax
**Learning:** Supabase `.or()` syntax requires careful formatting (comma-separated conditions). User input containing commas can break the query if not sanitized.
**Action:** Sanitize user input before passing it to Supabase `.or()` queries (e.g., replace commas with spaces).

## 2024-05-25 - React Effect Dependencies
**Learning:** Even if a state variable is not currently changeable by the UI (e.g. `minPrice` initialized to 0), it should be included in `useEffect` dependency arrays to ensure future correctness and prevent stale closures if the UI evolves.
**Action:** Audit `useEffect` dependency arrays to ensure all used state variables are included.
