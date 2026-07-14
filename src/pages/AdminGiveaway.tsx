import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Entry = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_academy_member: boolean;
  is_fotm_member: boolean;
  baker_status: string;
  baker_status_other: string | null;
  consent: boolean;
  created_at: string;
};

// Weekly windows Nov 5 - Dec 25, 2026
const WEEKS: { label: string; start: Date; end: Date }[] = (() => {
  const start = new Date("2026-11-05T00:00:00");
  const end = new Date("2026-12-25T23:59:59");
  const out: { label: string; start: Date; end: Date }[] = [];
  let cur = new Date(start);
  let i = 1;
  while (cur <= end) {
    const wEnd = new Date(cur);
    wEnd.setDate(wEnd.getDate() + 6);
    if (wEnd > end) wEnd.setTime(end.getTime());
    out.push({
      label: `Week ${i}: ${cur.toLocaleDateString()} – ${wEnd.toLocaleDateString()}`,
      start: new Date(cur),
      end: new Date(wEnd),
    });
    cur.setDate(cur.getDate() + 7);
    i++;
  }
  return out;
})();

const STATUS_LABEL: Record<string, string> = {
  baking_for_self: "Baking for self/family",
  thinking_of_selling: "Thinking of selling",
  has_cottage_business: "Cottage food business",
  other: "Other",
};

export default function AdminGiveaway() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [weekIdx, setWeekIdx] = useState<number | "all">("all");
  const [winner, setWinner] = useState<Entry | null>(null);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      // check admin via user_roles (RLS lets user see own roles)
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sess.session.user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) {
        const { data, error } = await supabase
          .from("giveaway_entries")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) toast.error(error.message);
        else setEntries((data as Entry[]) ?? []);
      }
      setLoading(false);
    })();
  }, [navigate]);

  const filtered = useMemo(() => {
    if (weekIdx === "all") return entries;
    const w = WEEKS[weekIdx];
    return entries.filter((e) => {
      const d = new Date(e.created_at);
      return d >= w.start && d <= w.end;
    });
  }, [entries, weekIdx]);

  const exportCsv = () => {
    const headers = ["created_at", "first_name", "last_name", "email", "academy", "fotm", "baker_status", "baker_status_other"];
    const rows = filtered.map((e) => [
      e.created_at,
      e.first_name,
      e.last_name,
      e.email,
      e.is_academy_member ? "yes" : "no",
      e.is_fotm_member ? "yes" : "no",
      STATUS_LABEL[e.baker_status] ?? e.baker_status,
      e.baker_status_other ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `giveaway-entries-${weekIdx === "all" ? "all" : `week-${weekIdx + 1}`}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pickWinner = () => {
    if (filtered.length === 0) {
      toast.error("No entries in this window.");
      return;
    }
    const w = filtered[Math.floor(Math.random() * filtered.length)];
    setWinner(w);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-flour">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-flour text-ink flex items-center justify-center px-5">
        <Helmet><meta name="robots" content="noindex,nofollow" /></Helmet>
        <div className="max-w-md rounded-2xl border border-parchment-deep bg-white p-8 text-center shadow-lg">
          <h1 className="font-display text-2xl font-semibold text-crust">Not authorized</h1>
          <p className="mt-2 text-sm text-crumb">
            Your account is signed in but doesn't have admin access to this dashboard. Ask Henry to grant you the admin role.
          </p>
          <button onClick={signOut} className="mt-5 rounded-full border border-crust px-5 py-2 font-bold text-crust hover:bg-crust hover:text-flour">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-flour text-ink">
      <Helmet>
        <title>Giveaway Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <header className="border-b border-parchment-deep bg-white/70 px-5 py-4">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-semibold text-crust">Give Bread Instead — Giveaway Entries</h1>
          <button onClick={signOut} className="ml-auto rounded-full border border-crust px-4 py-1.5 text-sm font-bold text-crust hover:bg-crust hover:text-flour">
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-5 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold text-crust">
            Week:
            <select
              value={weekIdx === "all" ? "all" : String(weekIdx)}
              onChange={(e) => setWeekIdx(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="ml-2 rounded-lg border-[1.5px] border-parchment-deep bg-white px-3 py-1.5 text-sm"
            >
              <option value="all">All entries</option>
              {WEEKS.map((w, i) => (
                <option key={i} value={i}>{w.label}</option>
              ))}
            </select>
          </label>
          <button onClick={pickWinner} className="rounded-full bg-cranberry px-5 py-2 text-sm font-bold text-flour hover:bg-cranberry-deep">
            🎁 Pick random winner
          </button>
          <button onClick={exportCsv} className="rounded-full border-[1.5px] border-crust px-5 py-2 text-sm font-bold text-crust hover:bg-crust hover:text-flour">
            Export CSV
          </button>
          <span className="ml-auto text-sm text-crumb">{filtered.length} entries</span>
        </div>

        {winner && (
          <div className="mb-6 rounded-xl border-2 border-honey bg-honey/10 p-5">
            <p className="text-sm font-bold text-crust">This week's winner:</p>
            <p className="mt-1 font-display text-xl text-crust">
              {winner.first_name} {winner.last_name} — {winner.email}
            </p>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-parchment-deep bg-white">
          <table className="w-full text-sm">
            <thead className="bg-parchment/50 text-left text-crust">
              <tr>
                <th className="p-3">Entered</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Academy</th>
                <th className="p-3">FOTM</th>
                <th className="p-3">Baker status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-t border-parchment-deep/50">
                  <td className="p-3 text-xs text-crumb whitespace-nowrap">{new Date(e.created_at).toLocaleString()}</td>
                  <td className="p-3">{e.first_name} {e.last_name}</td>
                  <td className="p-3">{e.email}</td>
                  <td className="p-3">{e.is_academy_member ? "✓" : ""}</td>
                  <td className="p-3">{e.is_fotm_member ? "✓" : ""}</td>
                  <td className="p-3 text-xs">
                    {STATUS_LABEL[e.baker_status] ?? e.baker_status}
                    {e.baker_status_other ? ` — ${e.baker_status_other}` : ""}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-crumb">No entries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}