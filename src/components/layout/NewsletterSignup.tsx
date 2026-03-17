"use client";

import { useState } from "react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-forest-light text-sm">
        <CheckCircle className="w-4 h-4 flex-shrink-0" />
        <span>Bedankt! U bent ingeschreven.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oak-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Uw e-mailadres"
            className="w-full pl-9 pr-3 py-2.5 bg-oak-700 border border-oak-600 rounded-lg text-sm text-white placeholder-oak-400 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
          />
        </div>
        <Button
          type="submit"
          variant="gold"
          size="sm"
          loading={status === "loading"}
        >
          OK
        </Button>
      </div>
      {status === "error" && (
        <p className="flex items-center gap-1.5 text-error text-xs">
          <AlertCircle className="w-3 h-3" />
          Er ging iets fout. Probeer het opnieuw.
        </p>
      )}
    </form>
  );
}
