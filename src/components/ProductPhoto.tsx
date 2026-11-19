import { useEffect, useState } from "react";

type ProductPhotoProps = {
  src: string;
  name: string;
  ribbon?: string;
};

/** A generous, undecorated stage for authentic product photography. */
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

    </div>
  );
}
