/** Wraps an asset path for safe use in CSS `background-image` (handles spaces and parentheses). */
export function cssBackgroundUrl(path: string): string {
  return `url('${path.replace(/'/g, "\\'")}')`;
}
