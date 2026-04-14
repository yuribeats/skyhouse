"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("done");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="font-body text-sm tracking-wider text-neptune-teal">
        SUBSCRIBED
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        placeholder="YOUR EMAIL"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 border border-neptune-blue/40 bg-transparent px-4 py-2 font-body text-sm tracking-wider text-white outline-none transition-colors focus:border-neptune-teal"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-neptune-blue px-6 py-2 font-body text-sm tracking-wider text-white transition-colors hover:bg-neptune-teal disabled:opacity-50"
      >
        {status === "sending" ? "..." : "SUBSCRIBE"}
      </button>
    </form>
  );
}
