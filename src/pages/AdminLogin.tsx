import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin/giveaway", { replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      navigate("/admin/giveaway", { replace: true });
    } else {
      const redirectUrl = `${window.location.origin}/admin/giveaway`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. Check your email if confirmation is required.");
    }
  };

  return (
    <div className="min-h-screen bg-flour text-ink flex items-center justify-center px-5">
      <Helmet>
        <title>Admin Sign In</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="w-full max-w-md rounded-2xl border border-parchment-deep bg-white p-8 shadow-lg">
        <h1 className="font-display text-2xl font-semibold text-crust">Admin sign in</h1>
        <p className="mt-1 text-sm text-crumb">Access the giveaway dashboard.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-crust">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border-[1.5px] border-parchment-deep bg-white px-3 py-2 text-sm focus:border-honey focus:outline-none"
            />
          </label>
          <label className="block text-sm font-semibold text-crust">
            Password
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border-[1.5px] border-parchment-deep bg-white px-3 py-2 text-sm focus:border-honey focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full min-h-[44px] rounded-full bg-cranberry px-5 py-2 font-bold text-flour hover:bg-cranberry-deep disabled:opacity-60"
          >
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 text-sm text-crumb underline hover:text-crust"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}