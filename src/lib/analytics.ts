// Centralized LaunchGuard analytics helper for gifts.bakinggreatbread.com
// Feeds /admin/analytics via sendBeacon (non-blocking on outbound clicks) + optional GA4 passthrough.

export type AnalyticsEventName =
  | "page_view"
  | "outbound_affiliate_click"
  | "promo_code_copy"
  | "academy_cert_cta_click"
  | "academy_cert_email_copy"
  | "quiz_start"
  | "quiz_step"
  | "quiz_complete"
  | "quiz_pick_click"
  | "filter_used"
  | "wishlist_toggle"
  | "giveaway_modal_open"
  | "free_guide_click"
  | "maker_door_click";

export interface AnalyticsPayload {
  [key: string]: string | number | boolean | null | undefined;
}

const SESSION_KEY = "bgb_gift_session_uuid";
const IGNORE_KEY = "bgb_ignore_analytics";
// Feeds public.guide_events (via the record_guide_event RPC), which powers /admin/analytics.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const ENDPOINT = `${SUPABASE_URL}/rest/v1/rpc/record_guide_event`;

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return crypto.randomUUID();
  }
}

function getUtm(): { source: string; medium: string; campaign: string } {
  try {
    const q = new URLSearchParams(window.location.search);
    let ref = "";
    try { ref = document.referrer ? new URL(document.referrer).hostname : ""; } catch { /* ignore */ }
    if (ref === window.location.hostname) ref = "";
    return { source: q.get("utm_source") || ref || "direct", medium: q.get("utm_medium") || "", campaign: q.get("utm_campaign") || "" };
  } catch {
    return { source: "direct", medium: "", campaign: "" };
  }
}

function getEnvironment(): "production" | "preview" {
  const h = window.location.hostname;
  return h === "localhost" || h.includes("preview") || h.includes("lovableproject") ? "preview" : "production";
}

export function trackEvent(event: AnalyticsEventName, props: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(IGNORE_KEY) === "1") return;
  } catch {
    // ignore storage errors
  }

  const str = (v: unknown) => (v === undefined || v === null ? "" : String(v));
  const payload = {
    event,
    session: getSessionId(),
    product: str(props.slug ?? props.maker_id),
    brand: str(props.brand),
    section: str(props.section ?? props.surface ?? props.filter_type),
    path: window.location.pathname,
    device: window.innerWidth < 768 ? "mobile" : "desktop",
    environment: getEnvironment(),
    ...getUtm(),
  };

  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag("event", event, props);

  // keepalive so outbound affiliate clicks are not dropped when the page navigates
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    body: JSON.stringify({ payload }),
    keepalive: true,
  }).catch(() => {
    // fail silently so UX is never interrupted
  });
}
