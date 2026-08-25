import { Heart, ExternalLink, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWishlist } from "@/hooks/useWishlist";

export type WishlistItem = {
  slug: string;
  name: string;
  brand: string;
  img: string;
  url: string;
  priceLabel: string;
};

/** Modal list of every gift the visitor has saved, with links back out to buy. */
export function WishlistDrawer({
  open,
  onClose,
  lookup,
}: {
  open: boolean;
  onClose: () => void;
  lookup: (slug: string) => WishlistItem | undefined;
}) {
  const { slugs, remove, clear } = useWishlist();
  const items = slugs.map(lookup).filter(Boolean) as WishlistItem[];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] w-[calc(100vw-2rem)] max-w-[560px] overflow-y-auto bg-flour p-5 text-ink sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-crust">Your saved gifts</DialogTitle>
          <DialogDescription className="text-crumb">
            {items.length === 0
              ? "Nothing saved yet. Tap the heart on any gift and it lands here."
              : `${items.length} gift${items.length === 1 ? "" : "s"} saved on this device. They stay put if you close the tab.`}
          </DialogDescription>
        </DialogHeader>

        {items.length > 0 && (
          <>
            <ul className="mt-2 space-y-3">
              {items.map((it) => (
                <li
                  key={it.slug}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-parchment-deep bg-white/70 p-3"
                >
                  <img
                    src={it.img}
                    alt={it.name}
                    loading="lazy"
                    className="h-12 w-12 flex-none object-contain"
                    style={{ mixBlendMode: "multiply" }}
                  />
                  <div className="min-w-[8rem] flex-1">
                    <p className="truncate text-[.72rem] uppercase tracking-wide text-crumb">{it.brand}</p>
                    <p className="truncate font-semibold text-crust">{it.name}</p>
                    <p className="text-sm text-crumb">{it.priceLabel}</p>
                  </div>
                  <div className="flex flex-none items-center gap-2">
                    <a
                      href={it.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-1 rounded-[10px] bg-evergreen px-3 text-[.82rem] font-bold text-flour hover:bg-evergreen-deep"
                    >
                      Gift it <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                    <button
                      onClick={() => remove(it.slug)}
                      aria-label={`Remove ${it.name} from saved gifts`}
                      className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-[10px] border border-parchment-deep text-crumb hover:border-cranberry hover:text-cranberry"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={clear}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 self-start rounded-full border border-parchment-deep px-4 text-sm font-semibold text-crumb hover:border-cranberry hover:text-cranberry"
            >
              <Heart className="h-4 w-4" aria-hidden /> Clear the list
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
