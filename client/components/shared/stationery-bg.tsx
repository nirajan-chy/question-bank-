import { cn } from "@/lib/utils";

type StationeryBgProps = {
  className?: string;
  variant?: "default" | "compact" | "wide";
};

const icons = [
  // Open book
  (key: number) => (
    <svg key={key} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12C20 8 14 6 8 6v28c6 0 12 2 16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 12c4-4 10-6 16-6v28c-6 0-12 2-16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 12v28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Pen
  (key: number) => (
    <svg key={key} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 6l6 6-22 22H6v-6L28 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 10l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 34h28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Compass (drawing)
  (key: number) => (
    <svg key={key} width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="18" r="12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 6V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 30l-4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 30l4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 18l6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Pencil
  (key: number) => (
    <svg key={key} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26 4l6 6-20 20H6v-6L26 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 32l4-12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Ruler
  (key: number) => (
    <svg key={key} width="52" height="28" viewBox="0 0 52 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="50" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 1v8M18 1v5M26 1v8M34 1v5M42 1v8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  // Lightbulb
  (key: number) => (
    <svg key={key} width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2C11 2 6 7.5 6 14c0 4.5 2.5 7.5 6 10v6h12v-6c3.5-2.5 6-5.5 6-10 0-6.5-5-12-12-12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 32h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 36h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Graduation cap
  (key: number) => (
    <svg key={key} width="44" height="36" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 4L2 16l20 12 20-12L22 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 20v10c0 0 4 4 12 4s12-4 12-4V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 16v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Test tube / beaker
  (key: number) => (
    <svg key={key} width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4h12M12 4v16l-8 16a2 2 0 002 2h16a2 2 0 002-2l-8-16V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 28h16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  // Eraser
  (key: number) => (
    <svg key={key} width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" transform="rotate(-10 2 4)" />
      <path d="M30 14l8-8M34 10l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Protractor
  (key: number) => (
    <svg key={key} width="44" height="28" viewBox="0 0 44 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 26a20 20 0 0140 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 26V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2" />
      <path d="M8 22l4-4M32 22l-4-4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  // Backpack
  (key: number) => (
    <svg key={key} width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="12" width="24" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12V8a6 6 0 0112 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 22h24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <circle cx="18" cy="28" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  // Sticky note
  (key: number) => (
    <svg key={key} width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4h28v24H20l-4 4-4-4H4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 14h12M12 20h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function StationeryBg({ className, variant = "default" }: StationeryBgProps) {
  const count = variant === "compact" ? 80 : variant === "wide" ? 160 : 120;
  const rand = seededRandom(42);

  const items = Array.from({ length: count }, (_, i) => {
    const IconFn = icons[i % icons.length];
    const x = rand() * 100;
    const y = rand() * 100;
    const rotate = rand() * 40 - 20;
    const scale = 0.3 + rand() * 0.9;
    const animDelay = rand() * 5;
    const animDuration = 4 + rand() * 4;
    return { icon: IconFn(i), x, y, rotate, scale, animDelay, animDuration };
  });

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animationDelay: `${item.animDelay}s`,
            animationDuration: `${item.animDuration}s`,
          }}
        >
          <div
            className="text-neutral-500/[0.12] dark:text-white/[0.08]"
            style={{
              transform: `rotate(${item.rotate}deg) scale(${item.scale})`,
            }}
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
