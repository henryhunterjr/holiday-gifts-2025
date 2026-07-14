import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import giveBreadTag from "@/assets/holiday/give-bread-instead-tag.png.asset.json";

const schema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(100),
  last_name: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  is_academy_member: z.boolean(),
  is_fotm_member: z.boolean(),
  baker_status: z.enum(["baking_for_self", "thinking_of_selling", "has_cottage_business", "other"]),
  baker_status_other: z.string().trim().max(500).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "You must agree to receive emails" }) }),
});

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  is_academy_member: boolean;
  is_fotm_member: boolean;
  baker_status: "baking_for_self" | "thinking_of_selling" | "has_cottage_business" | "other" | "";
  baker_status_other: string;
  consent: boolean;
};

const EMPTY: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  is_academy_member: false,
  is_fotm_member: false,
  baker_status: "",
  baker_status_other: "",
  consent: false,
};

const STATUS_OPTIONS: { value: FormState["baker_status"]; label: string }[] = [
  { value: "baking_for_self", label: "Baking bread for myself and the ones I love" },
  { value: "thinking_of_selling", label: "Thinking about selling my bread" },
  { value: "has_cottage_business", label: "I currently have a cottage food business" },
  { value: "other", label: "Other" },
];

export function GiveawayModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setForm(EMPTY);
    setDone(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 250);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("giveaway_entries").insert({
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      email: parsed.data.email,
      is_academy_member: parsed.data.is_academy_member,
      is_fotm_member: parsed.data.is_fotm_member,
      baker_status: parsed.data.baker_status,
      baker_status_other: parsed.data.baker_status === "other" ? parsed.data.baker_status_other || null : null,
      consent: parsed.data.consent,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    setDone(true);
    toast.success("You're entered. Good luck!");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-lg bg-flour p-0 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center bg-[hsl(38_55%_92%)] px-6 pb-4 pt-6 border-b border-parchment-deep">
          <img
            src={giveBreadTag.url}
            alt="Give Bread Instead"
            className="h-24 w-auto object-contain drop-shadow"
          />
        </div>
        <div className="p-6">
          <DialogHeader className="text-left">
            <p className="eyebrow">Weekly giveaway</p>
            <DialogTitle className="font-display text-2xl font-semibold text-crust">
              Win the Give Bread Instead Gift Tag Set
            </DialogTitle>
            <DialogDescription className="text-crumb">
              A new winner picked each week, November 5 through December 25. Includes printable gift tag templates and greeting cards.
            </DialogDescription>
          </DialogHeader>

          {done ? (
            <div className="mt-6 rounded-xl border-2 border-dashed border-evergreen/40 bg-white p-6 text-center">
              <p className="font-display text-xl font-semibold text-crust">You're on the list.</p>
              <p className="mt-2 text-sm text-crumb">Watch your inbox — weekly winners get an email from Henry.</p>
              <button
                onClick={handleClose}
                className="mt-5 min-h-[44px] rounded-full bg-cranberry px-6 py-2 font-bold text-flour hover:bg-cranberry-deep"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold text-crust">
                  First name
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="mt-1 w-full rounded-lg border-[1.5px] border-parchment-deep bg-white px-3 py-2 text-sm text-ink focus:border-honey focus:outline-none"
                  />
                </label>
                <label className="block text-sm font-semibold text-crust">
                  Last name
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="mt-1 w-full rounded-lg border-[1.5px] border-parchment-deep bg-white px-3 py-2 text-sm text-ink focus:border-honey focus:outline-none"
                  />
                </label>
              </div>
              <label className="block text-sm font-semibold text-crust">
                Email
                <input
                  type="email"
                  required
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border-[1.5px] border-parchment-deep bg-white px-3 py-2 text-sm text-ink focus:border-honey focus:outline-none"
                />
              </label>

              <div className="rounded-lg border border-parchment-deep bg-white/70 p-3 space-y-2">
                <label className="flex items-start gap-2 text-sm text-crust">
                  <input
                    type="checkbox"
                    checked={form.is_academy_member}
                    onChange={(e) => setForm({ ...form, is_academy_member: e.target.checked })}
                    className="mt-1"
                  />
                  <span>I'm a member of the <b>Crust &amp; Crumb Academy</b></span>
                </label>
                <label className="flex items-start gap-2 text-sm text-crust">
                  <input
                    type="checkbox"
                    checked={form.is_fotm_member}
                    onChange={(e) => setForm({ ...form, is_fotm_member: e.target.checked })}
                    className="mt-1"
                  />
                  <span>I'm a member of <b>From Oven to Market</b></span>
                </label>
              </div>

              <fieldset className="rounded-lg border border-parchment-deep bg-white/70 p-3">
                <legend className="px-1 text-sm font-semibold text-crust">Where are you in your baking journey?</legend>
                <div className="mt-2 space-y-2">
                  {STATUS_OPTIONS.map((o) => (
                    <label key={o.value} className="flex items-start gap-2 text-sm text-ink">
                      <input
                        type="radio"
                        name="baker_status"
                        value={o.value}
                        checked={form.baker_status === o.value}
                        onChange={() => setForm({ ...form, baker_status: o.value })}
                        className="mt-1"
                        required
                      />
                      <span>{o.label}</span>
                    </label>
                  ))}
                </div>
                {form.baker_status === "other" && (
                  <input
                    type="text"
                    placeholder="Tell me more…"
                    maxLength={500}
                    value={form.baker_status_other}
                    onChange={(e) => setForm({ ...form, baker_status_other: e.target.value })}
                    className="mt-3 w-full rounded-lg border-[1.5px] border-parchment-deep bg-white px-3 py-2 text-sm text-ink focus:border-honey focus:outline-none"
                  />
                )}
              </fieldset>

              <label className="flex items-start gap-2 text-xs text-crumb">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  className="mt-1"
                  required
                />
                <span>
                  By submitting this form and providing my email address, I agree to receive periodic emails from Henry with new recipes, giveaways, and goings-on in the Crust &amp; Crumb Academy and the From Oven to Market community.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[48px] rounded-full bg-cranberry px-6 py-3 font-bold text-flour shadow-md transition-colors hover:bg-cranberry-deep disabled:opacity-60"
              >
                {submitting ? "Entering…" : "Enter the giveaway"}
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}