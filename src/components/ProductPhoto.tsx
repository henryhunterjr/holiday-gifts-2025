import { useEffect, useState } from "react";

type ProductPhotoProps = {
  src: string;
  name: string;
  ribbon?: string;
};

/** Consistent photo stage. Decoration never covers the product or intercepts a click. */
export function ProductPhoto({ src, name, ribbon }: ProductPhotoProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  return (
    <div className="holiday-product-photo">
      {ribbon && <span className="holiday-pick-ribbon">{ribbon}</span>}
      <div className="holiday-photo-mat">
        {failed ? (
          <span className="holiday-photo-fallback">See {name} at the store</span>
        ) : (
          <img src={src} alt={name} loading="lazy" decoding="async" onError={() => setFailed(true)} />
        )}
      </div>
      <svg className="holiday-pine" viewBox="0 0 110 90" fill="none" aria-hidden="true" focusable="false">
        <g stroke="#355741" strokeWidth="1.8" strokeLinecap="round">
          <path d="M103 85 26 22M101 84 77 9M101 84 11 64" stroke="#806748" />
          <path d="m36 30-18 1m26 6-20 1m28 6-22 1m30 6-24 2m32 5-24 3m32 4-25 3m33 4-24 3
            M36 30l-3-17m11 24-3-18m11 25-3-20m11 27-3-22m11 29-3-22m11 29-3-22
            M81 25l-12-7m16 19-13-7m17 19-14-7m18 19-14-7m-9-29 8-13m-4 25 9-14m-5 26 9-14
            M27 68l-8-12m22 15-10-14m24 18-11-15m25 18-12-15m26 18-13-15
            M27 68l-9 9m23-6-10 10m24-6-11 11m25-8-10 10" />
        </g>
        <circle cx="87" cy="72" r="4" fill="#9e2b25" />
        <circle cx="94" cy="77" r="4.5" fill="#b23b31" />
        <circle cx="85" cy="80" r="3.5" fill="#7c1f1b" />
      </svg>
    </div>
  );
}
