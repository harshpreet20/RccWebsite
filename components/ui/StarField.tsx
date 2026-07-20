// Deterministic pseudo-random generator (mulberry32) so the dot positions
// are identical on the server render and the client hydration pass —
// using Math.random() directly here would break hydration.
function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED = 1337;

function generateDots(count: number) {
  const random = mulberry32(SEED);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${(random() * 100).toFixed(2)}%`,
    left: `${(random() * 100).toFixed(2)}%`,
    size: 1 + Math.round(random() * 2),
    opacity: (0.2 + random() * 0.5).toFixed(2),
  }));
}

export default function StarField({
  count = 40,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  const dots = generateDots(count);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {dots.map((dot) => (
        <span
          key={dot.id}
          className="absolute rounded-full bg-white"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
          }}
        />
      ))}
    </div>
  );
}
