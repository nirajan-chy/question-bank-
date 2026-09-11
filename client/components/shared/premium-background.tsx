"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

/* ── SVG Icons (thin-line 1.5px stroke, outline only) ── */

const iconPaths: Record<string, JSX.Element> = {
  book: (
    <>
      <path d="M24 12C20 8 14 6 8 6v28c6 0 12 2 16 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 12c4-4 10-6 16-6v28c-6 0-12 2-16 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 12v28" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  graduation: (
    <>
      <path d="M22 4L2 16l20 12 20-12L22 4z" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 20v10c0 0 4 4 12 4s12-4 12-4V20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 16v12" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  pencil: (
    <>
      <path d="M26 4l6 6-20 20H6v-6L26 4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 8l6 6" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  notebook: (
    <>
      <rect x="6" y="4" width="32" height="40" rx="3" strokeWidth="1.5" />
      <path d="M14 4v40" strokeWidth="1.5" />
      <path d="M20 14h12M20 22h12M20 30h8" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  flask: (
    <>
      <path d="M16 4h8M18 4v14l-8 18a2 2 0 002 2h16a2 2 0 002-2l-8-18V4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M24 2C17 2 12 7.5 12 14c0 4.5 2.5 7.5 6 10v6h12v-6c3.5-2.5 6-5.5 6-10 0-6.5-5-12-12-12z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 32h12M20 36h8" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  ruler: (
    <>
      <rect x="2" y="8" width="44" height="16" rx="2" strokeWidth="1.5" />
      <path d="M10 8v6M18 8v4M26 8v6M34 8v4" strokeWidth="1" strokeLinecap="round" />
    </>
  ),
  calculator: (
    <>
      <rect x="8" y="4" width="32" height="40" rx="3" strokeWidth="1.5" />
      <rect x="14" y="10" width="20" height="8" rx="1" strokeWidth="1.2" />
      <circle cx="16" cy="26" r="1.5" strokeWidth="1.2" />
      <circle cx="24" cy="26" r="1.5" strokeWidth="1.2" />
      <circle cx="32" cy="26" r="1.5" strokeWidth="1.2" />
      <circle cx="16" cy="34" r="1.5" strokeWidth="1.2" />
      <circle cx="24" cy="34" r="1.5" strokeWidth="1.2" />
      <circle cx="32" cy="34" r="1.5" strokeWidth="1.2" />
    </>
  ),
  certificate: (
    <>
      <rect x="6" y="6" width="36" height="28" rx="2" strokeWidth="1.5" />
      <path d="M16 20h16M16 26h10" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="34" cy="40" r="5" strokeWidth="1.5" />
      <path d="M34 45v5" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  backpack: (
    <>
      <rect x="10" y="16" width="28" height="28" rx="4" strokeWidth="1.5" />
      <path d="M16 16V12a8 8 0 0116 0v4" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 26h28" strokeWidth="1" strokeLinecap="round" />
      <circle cx="24" cy="34" r="2" strokeWidth="1.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="24" cy="24" r="20" strokeWidth="1.5" />
      <ellipse cx="24" cy="24" rx="10" ry="20" strokeWidth="1.2" />
      <path d="M4 24h40" strokeWidth="1" />
      <path d="M8 14h32M8 34h32" strokeWidth="0.8" />
    </>
  ),
  document: (
    <>
      <path d="M10 4h20l10 10v30a2 2 0 01-2 2H10a2 2 0 01-2-2V6a2 2 0 012-2z" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M30 4v10h10" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 24h16M16 32h12" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
};

const iconNames = Object.keys(iconPaths);

/* ── Placement definitions ── */

interface IconDef {
  icon: string;
  x: number;
  y: number;
  size: number;
  layer: 0 | 1 | 2;
  delay: number;
  duration: number;
  rotate: number;
  driftX: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateIcons(): IconDef[] {
  const rand = seededRandom(7);
  const icons: IconDef[] = [];

  // Hero safe zone: center 36% width, 15%–65% height
  const isSafe = (x: number, y: number) =>
    x > 32 && x < 68 && y > 12 && y < 68;

  const layers: {
    count: number;
    sizeMin: number;
    sizeMax: number;
    opacity: number;
    blur: number;
    durMin: number;
    durMax: number;
    driftMin: number;
    driftMax: number;
  }[] = [
    // Background: 8 icons, 4% opacity, slow, slight blur
    { count: 8, sizeMin: 18, sizeMax: 26, opacity: 0.04, blur: 0.5, durMin: 20, durMax: 28, driftMin: 4, driftMax: 10 },
    // Middle: 10 icons, 6% opacity, medium
    { count: 10, sizeMin: 22, sizeMax: 34, opacity: 0.06, blur: 0, durMin: 16, durMax: 24, driftMin: 6, driftMax: 14 },
    // Foreground: 6 icons, 8% opacity, larger, faster
    { count: 6, sizeMin: 32, sizeMax: 48, opacity: 0.08, blur: 0, durMin: 14, durMax: 20, driftMin: 8, driftMax: 18 },
  ];

  layers.forEach((cfg, layerIdx) => {
    for (let i = 0; i < cfg.count; i++) {
      let x: number, y: number, attempts = 0;
      do {
        x = rand() * 92 + 4;
        y = rand() * 88 + 4;
        attempts++;
      } while (isSafe(x, y) && attempts < 60);

      icons.push({
        icon: iconNames[(layerIdx * 12 + i * 3) % iconNames.length],
        x,
        y,
        size: cfg.sizeMin + rand() * (cfg.sizeMax - cfg.sizeMin),
        layer: layerIdx as 0 | 1 | 2,
        delay: rand() * 12,
        duration: cfg.durMin + rand() * (cfg.durMax - cfg.durMin),
        rotate: (rand() - 0.5) * 12,
        driftX: cfg.driftMin + rand() * (cfg.driftMax - cfg.driftMin),
      });
    }
  });

  return icons;
}

/* ── Dust particles ── */

function generateParticles(count: number) {
  const rand = seededRandom(99);
  return Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: 1 + rand() * 1.5,
    delay: rand() * 20,
    duration: 14 + rand() * 18,
  }));
}

/* ── Layer visual config ── */

const LAYER_CFG = [
  { opacity: 0.2, blur: 0.5 },
  { opacity: 0.25, blur: 0 },
  { opacity: 0.3, blur: 0 },
];

const PARALLAX_MULT = [4, 8, 12];

/* ── Main Component ── */

export function PremiumBackground() {
  const allIcons = useMemo(() => generateIcons(), []);
  const particles = useMemo(() => generateParticles(14), []);
  const [reducedMotion, setReducedMotion] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springCfg = { stiffness: 40, damping: 20, mass: 0.8 };
  const springX = useSpring(mouseX, springCfg);
  const springY = useSpring(mouseY, springCfg);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const handleMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set((e.clientX - cx) / cx);
      mouseY.set((e.clientY - cy) / cy);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY, reducedMotion]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {/* Dotted grid texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #000 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
          opacity: 0.04,
        }}
      />

      {/* Three icon layers */}
      {[0, 1, 2].map((layerIdx) => {
        const layerIcons = allIcons.filter((ic) => ic.layer === layerIdx);
        const cfg = LAYER_CFG[layerIdx];
        const pMult = PARALLAX_MULT[layerIdx];

        return (
          <motion.div
            key={layerIdx}
            className="absolute inset-0"
            style={{
              filter: cfg.blur ? `blur(${cfg.blur}px)` : undefined,
              x: reducedMotion ? 0 : springX,
              y: reducedMotion ? 0 : springY,
              // Framer Motion handles the spring-based parallax on this wrapper
            }}
            // Override: multiply parallax amount per layer
            {...(!reducedMotion && {
              style: {
                filter: cfg.blur ? `blur(${cfg.blur}px)` : undefined,
                x: reducedMotion ? 0 : undefined,
                y: reducedMotion ? 0 : undefined,
              },
            })}
          >
            {layerIcons.map((ic, i) => (
              <FloatingIcon
                key={`${layerIdx}-${i}`}
                icon={ic}
                opacity={cfg.opacity}
                reducedMotion={reducedMotion}
                mouseX={mouseX}
                mouseY={mouseY}
                parallaxMult={pMult}
              />
            ))}
          </motion.div>
        );
      })}

      {/* Dust particles */}
      {!reducedMotion &&
        particles.map((p, i) => (
          <div
            key={`dust-${i}`}
            className="absolute rounded-full bg-neutral-900"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: 0.04,
              animation: `dustFloat ${p.duration}s ${p.delay}s ease-in-out infinite`,
            }}
          />
        ))}

      {/* Global keyframes */}
      <style jsx global>{`
        @keyframes iconFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(var(--rot));
          }
          25% {
            transform: translate3d(var(--dx), -10px, 0) rotate(calc(var(--rot) + 2deg));
          }
          50% {
            transform: translate3d(calc(var(--dx) * -0.5), 6px, 0) rotate(calc(var(--rot) - 1.5deg));
          }
          75% {
            transform: translate3d(calc(var(--dx) * 0.3), -5px, 0) rotate(calc(var(--rot) + 1deg));
          }
        }
        @keyframes dustFloat {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.04; }
          30% { transform: translate3d(2px, -14px, 0); opacity: 0.06; }
          60% { transform: translate3d(-3px, -8px, 0); opacity: 0.02; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes iconFloat {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--rot)); }
          }
          @keyframes dustFloat {
            0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.04; }
          }
        }
      `}</style>
    </div>
  );
}

/* ── Individual floating icon ── */

function FloatingIcon({
  icon,
  opacity,
  reducedMotion,
  mouseX,
  mouseY,
  parallaxMult,
}: {
  icon: IconDef;
  opacity: number;
  reducedMotion: boolean;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  parallaxMult: number;
}) {
  const px = useSpring(0, { stiffness: 30, damping: 18 });
  const py = useSpring(0, { stiffness: 30, damping: 18 });

  useEffect(() => {
    if (reducedMotion) return;
    const unsubX = mouseX.on("change", (v) => px.set(v * parallaxMult));
    const unsubY = mouseY.on("change", (v) => py.set(v * parallaxMult));
    return () => { unsubX(); unsubY(); };
  }, [mouseX, mouseY, px, py, parallaxMult, reducedMotion]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${icon.x}%`,
        top: `${icon.y}%`,
        width: icon.size,
        height: icon.size,
        opacity,
        x: reducedMotion ? 0 : px,
        y: reducedMotion ? 0 : py,
        willChange: "transform",
      }}
    >
      <div
        style={{
          "--rot": `${icon.rotate}deg`,
          "--dx": `${icon.driftX}px`,
          animation: reducedMotion
            ? "none"
            : `iconFloat ${icon.duration}s ${icon.delay}s ease-in-out infinite`,
        } as React.CSSProperties}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full text-neutral-900"
        >
          {iconPaths[icon.icon]}
        </svg>
      </div>
    </motion.div>
  );
}
