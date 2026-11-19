# Project rules

- Keep regression tests for legacy-domain redirection in scripts/test-legacy-redirect.mjs; shoppers retain paths and sections while authentication credentials never cross origins.
- Call report RPCs through the client object, not a detached method; RPC methods need their client context, and report functions enforce the protected admin role server-side.- Maker pages exist only as static HTML generated from src/data/makers.json by scripts/build-makers.mjs; link to them with plain anchors so there is one copy to maintain.
- Prices are verified by scripts/check-prices.mjs (weekly GitHub Action); use --stamp to update priceChecked only for prices that matched the store.
