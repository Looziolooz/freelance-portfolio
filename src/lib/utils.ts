// Minimal classname joiner (clsx-style, no deps). Filters falsy values and
// joins with spaces. Enough for our component className composition.
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}
