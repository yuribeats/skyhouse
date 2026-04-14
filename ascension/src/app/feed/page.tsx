"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

interface Moment {
  tokenId: string;
  collection: string;
  createdAt: string;
  name: string;
  description: string;
  image: string;
  contentUri: string;
  contentMime: string;
  inprocessUrl: string;
}

export default function Feed() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Moment | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    const res = await fetch(`/api/feed?page=${p}&limit=20`);
    const data = await res.json();
    setMoments(data.moments || []);
    setTotalPages(data.pagination?.total_pages || 1);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const isVideo = (mime: string) => mime.startsWith("video/");
  const isAudio = (mime: string) => mime.startsWith("audio/");

  return (
    <motion.div
      className="mx-auto max-w-[1200px] px-6 py-24 md:px-12"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      <motion.div variants={fadeUp}>
        <h1 className="mb-2 font-display text-5xl text-white md:text-6xl">
          Forrest&apos;s Feed
        </h1>
        <p className="mb-12 font-body text-sm text-neptune-muted">
          TOKENS ON INPROCESS
        </p>
      </motion.div>

      {loading ? (
        <p className="text-neptune-muted">LOADING...</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moments.map((m) => (
              <motion.div
                key={`${m.collection}-${m.tokenId}`}
                variants={fadeUp}
                className="group border border-neptune-blue/30 bg-[#050505] transition-colors hover:border-neptune-teal"
              >
                {/* Media */}
                <button
                  onClick={() => setSelected(m)}
                  className="block w-full"
                >
                  {m.image && (
                    <img
                      src={m.image}
                      alt={m.name}
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                  )}
                </button>

                {/* Info */}
                <div className="p-4">
                  <h3 className="mb-1 font-body text-sm font-bold text-white">
                    {m.name || "UNTITLED"}
                  </h3>
                  {m.description && (
                    <p className="mb-3 line-clamp-2 font-body text-xs leading-relaxed text-neptune-muted">
                      {m.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs text-neptune-muted">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                    <a
                      href={m.inprocessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-xs text-neptune-teal transition-colors hover:text-neptune-glow"
                    >
                      VIEW ON INPROCESS
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border border-neptune-blue px-4 py-2 font-body text-xs text-white transition-colors hover:border-neptune-teal disabled:opacity-30"
              >
                PREV
              </button>
              <span className="font-body text-xs text-neptune-muted">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border border-neptune-blue px-4 py-2 font-body text-xs text-white transition-colors hover:border-neptune-teal disabled:opacity-30"
              >
                NEXT
              </button>
            </div>
          )}
        </>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] max-w-[900px] overflow-auto bg-[#050505] border border-neptune-blue/30"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo(selected.contentMime) ? (
              <video
                src={selected.contentUri}
                controls
                autoPlay
                className="w-full"
              />
            ) : isAudio(selected.contentMime) ? (
              <div className="p-8">
                {selected.image && (
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="mb-4 w-full"
                  />
                )}
                <audio src={selected.contentUri} controls className="w-full" />
              </div>
            ) : (
              <img
                src={selected.contentUri || selected.image}
                alt={selected.name}
                className="w-full"
              />
            )}
            <div className="p-6">
              <h2 className="mb-2 font-body text-lg font-bold text-white">
                {selected.name || "UNTITLED"}
              </h2>
              {selected.description && (
                <p className="mb-4 font-body text-sm leading-relaxed text-neptune-muted whitespace-pre-line">
                  {selected.description}
                </p>
              )}
              <a
                href={selected.inprocessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-neptune-teal px-6 py-2 font-body text-xs tracking-wider text-neptune-teal transition-colors hover:bg-neptune-teal hover:text-black"
              >
                VIEW ON INPROCESS
              </a>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
