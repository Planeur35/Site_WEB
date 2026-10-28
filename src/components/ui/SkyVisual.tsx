import GliderSilhouette from '@/components/ui/GliderSilhouette';

/** Sky gradients used when a page has no photo. */
export const SKY_TONES = [
  { from: '#274c77', mid: '#6096ba', to: '#a3c9e8' },
  { from: '#1d3557', mid: '#457b9d', to: '#bde0fe' },
  { from: '#355070', mid: '#6d597a', to: '#a8dadc' },
  { from: '#22577a', mid: '#38a3a5', to: '#bfe6e0' },
];

interface SkyVisualProps {
  variant?: number;
}

/** Drawn sky with clouds and two gliders. */
export default function SkyVisual({ variant = 0 }: SkyVisualProps) {
  const tone = SKY_TONES[variant % SKY_TONES.length];
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${tone.from} 0%, ${tone.mid} 55%, ${tone.to} 100%)` }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="180" cy="110" rx="130" ry="32" fill="white" opacity="0.35" />
        <ellipse cx="480" cy="70" rx="90" ry="20" fill="white" opacity="0.25" />
        <ellipse cx="700" cy="150" rx="150" ry="34" fill="white" opacity="0.3" />
        <ellipse cx="380" cy="300" rx="180" ry="36" fill="white" opacity="0.18" />
        <ellipse cx="850" cy="360" rx="200" ry="42" fill="white" opacity="0.22" />
        <line x1="0" y1="430" x2="1000" y2="430" stroke="white" strokeWidth="0.6" opacity="0.35" strokeDasharray="1 14" />
        <line x1="0" y1="470" x2="1000" y2="470" stroke="white" strokeWidth="0.6" opacity="0.22" strokeDasharray="1 18" />
      </svg>
      <GliderSilhouette className="absolute left-[10%] top-[22%] w-[26%] -rotate-[4deg] text-white/60" />
      <GliderSilhouette className="absolute bottom-[30%] right-[8%] w-[14%] rotate-[3deg] text-white/35" />
    </div>
  );
}
