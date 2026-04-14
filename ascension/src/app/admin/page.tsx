"use client";

import { useEffect, useState } from "react";

export default function Admin() {
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscribe")
      .then((r) => r.json())
      .then((data) => {
        setSubscribers(data.subscribers || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-[800px] px-6 py-24 md:px-12">
      <h1 className="mb-2 font-body text-2xl font-bold tracking-wider text-white">
        SUBSCRIBERS
      </h1>
      <p className="mb-8 font-body text-sm text-neptune-muted">
        {subscribers.length} TOTAL
      </p>

      {loading ? (
        <p className="text-neptune-muted">LOADING...</p>
      ) : subscribers.length === 0 ? (
        <p className="text-neptune-muted">NO SUBSCRIBERS YET</p>
      ) : (
        <div className="space-y-2">
          {subscribers.map((email) => (
            <div
              key={email}
              className="border border-neptune-blue/30 px-4 py-3 font-body text-sm text-white"
            >
              {email}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
