// Deterministic gradient assignment for content items (subjects, courses,
// universities, communities, etc.). The `gradient` column has been removed from
// the database and admin panel; public pages derive a stable color per item
// from its name so existing designs keep working without stored data.
const PALETTE = [
  "from-indigo-500 to-violet-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-fuchsia-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-sky-600",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function gradientFor(key?: string | null): string {
  if (!key) return PALETTE[0];
  return PALETTE[hashString(key) % PALETTE.length];
}
