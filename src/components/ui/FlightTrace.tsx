import clsx from 'clsx';

interface FlightTraceProps {
  /** Usually the item's title or _id: the same seed always draws the same trace. */
  seed: string;
  /** Frame size and aspect, e.g. "aspect-[4/3]". */
  className?: string;
  dotClassName?: string;
  /** Glider contest letters, drawn over a tail fin instead of the trace. */
  callsign?: string;
  /** Crop the drawing so the thermal spiral fills a small square frame. */
  thumbnail?: boolean;
  /** How the drawing sits in the frame (EmptyState aligns it right). */
  align?: 'center' | 'right';
}

// FNV-1a hash, then a tiny PRNG (mulberry32) for repeatable variety
function hash(s: string) {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.codePointAt(0)!;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function prng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** An approach, a thermal spiral drifting with the wind, then a glide to the end dot. */
export function tracePath(seed: string) {
  const r = prng(hash(seed));
  const x0 = 120 + r() * 120;
  const y0 = 210 + r() * 30; // thermal entry
  const loops = 3.5 + r() * 1.5;
  const rad = 30 + r() * 10; // turns and radius
  const climb = 30 + r() * 4;
  const drift = 10 + r() * 14; // per turn (wind drift)
  const end = { x: 540 + r() * 30, y: 120 + r() * 50 }; // glide end = dot
  const mirror = r() < 0.5;
  const k = 18;
  const n = Math.round(loops * k);
  const pts: [number, number][] = [[x0 - 90, y0 + 30]];
  for (let i = 0; i <= n; i++) {
    const t = (i / k) * 2 * Math.PI;
    const turns = t / (2 * Math.PI);
    pts.push([x0 + drift * turns + rad * Math.sin(t), y0 - climb * turns - rad * 0.42 * (1 - Math.cos(t))]);
  }
  pts.push([end.x, end.y]);
  const m = (x: number) => (mirror ? 600 - x : x);
  return {
    d: pts.map(([x, y], i) => `${i ? 'L' : 'M'}${Math.round(m(x))} ${Math.round(y)}`).join(' '),
    end: { x: Math.round(m(end.x)), y: Math.round(end.y) },
  };
}

/** Placeholder for a missing photo: a pale sky with a thin flight trace. Decorative only. */
export default function FlightTrace({
  seed,
  className,
  dotClassName = 'fill-balise-vif',
  callsign,
  thumbnail = false,
  align = 'center',
}: FlightTraceProps) {
  const frame = clsx('relative overflow-hidden bg-linear-to-b from-zenith via-brise via-62% to-ciel', className);

  if (callsign) {
    return (
      <div className={frame} aria-hidden="true">
        <svg viewBox="0 0 160 170" className="absolute bottom-0 right-4 h-4/5" aria-hidden="true">
          <path
            d="M40 160 L78 18 Q80 10 88 10 L128 10 Q136 10 134 18 L118 160 Z"
            className="fill-white/85 stroke-altitude/35"
            strokeWidth={1.5}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-[5.25rem] font-bold text-azur">
          {callsign}
        </span>
      </div>
    );
  }

  const { d, end } = tracePath(seed);
  return (
    <div className={frame} aria-hidden="true">
      <svg
        viewBox={thumbnail ? '40 40 520 240' : '0 0 600 300'}
        preserveAspectRatio={thumbnail ? 'xMidYMid slice' : align === 'right' ? 'xMaxYMid meet' : 'xMidYMid meet'}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d={d}
          className="fill-none stroke-altitude"
          strokeOpacity={0.45}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={end.x} cy={end.y} r={5} className={dotClassName} />
      </svg>
    </div>
  );
}
