// Decorative ornaments hanging from the top edge, same as the SPA home page.
// Purely visual: aria-hidden, lazy, and frozen by prefers-reduced-motion.
export function Ornaments() {
  return (
    <div className="ornaments" aria-hidden="true">
      <img src="/brand/ornament-bgb-logo.png" alt="" loading="lazy" decoding="async" width={220} height={110} className="ornament ornament-sway ornament-twinkle o1" />
      <img src="/brand/ornament-banneton.png" alt="" loading="lazy" decoding="async" width={184} height={92} className="ornament ornament-sway ornament-twinkle o2" />
    </div>
  );
}

// One small ornament for the slim facet header.
export function MiniOrnament() {
  return (
    <img src="/brand/ornament-banneton.png" alt="" aria-hidden="true" loading="lazy" decoding="async" width={168} height={84} className="mini-ornament ornament-sway ornament-twinkle" />
  );
}
