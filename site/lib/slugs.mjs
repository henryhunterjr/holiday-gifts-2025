// Slug rule for every facet in the /gifts namespace. Single source of truth:
// the app and the build tests both import this file.
// Rule: lowercase, drop ampersands, collapse whitespace runs to single hyphens.
// "Proofing & Temp" -> "proofing-temp".
export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
