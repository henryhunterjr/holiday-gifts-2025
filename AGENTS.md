# Project rules

- Keep regression tests for legacy-domain redirection in scripts/test-legacy-redirect.mjs; shoppers retain paths and sections while authentication credentials never cross origins.
- Call report RPCs through the client object, not a detached method; RPC methods need their client context, and report functions enforce the protected admin role server-side.