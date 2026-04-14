"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

interface ShopItem {
  id: string; name: string; price: string; description: string;
  category: string; ctaLabel: string; ctaUrl: string; featured: boolean;
}

export default function Shop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/shop")
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoaded(true); });
  }, []);

  if (!loaded) return null;

  if (items.length === 0) {
    return (
      <motion.div
        className="flex min-h-[60vh] items-center justify-center"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h1 className="font-display text-5xl text-white md:text-6xl">
          Coming Soon
        </h1>
      </motion.div>
    );
  }

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <motion.div
      className="mx-auto max-w-[1200px] px-6 py-24 md:px-12"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div variants={fadeUp}>
        <h1 className="mb-2 font-display text-5xl text-white md:text-6xl">
          The Ascension Store
        </h1>
        <div className="mb-16 h-[2px] w-16 bg-neptune-blue" />
      </motion.div>

      {categories.map((cat) => (
        <motion.div key={cat} variants={fadeUp} className="mb-16">
          <h2 className="mb-6 font-body text-xs tracking-[0.3em] text-neptune-muted">
            {cat.toUpperCase()}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {items.filter((i) => i.category === cat).map((item) => (
              <div
                key={item.id}
                className={`flex flex-col gap-4 border p-6 transition-colors duration-200 ${
                  item.featured
                    ? "border-neptune-teal bg-[#050505]"
                    : "border-neptune-blue/40 bg-[#050505] hover:border-neptune-teal"
                }`}
              >
                <h3 className="font-body text-base tracking-wider text-white">{item.name}</h3>
                <p className="font-body text-lg text-neptune-teal">{item.price}</p>
                {item.description && (
                  <p className="font-body text-sm leading-relaxed text-neptune-muted">{item.description}</p>
                )}
                <a
                  href={item.ctaUrl || "#"}
                  className={`mt-auto inline-block border px-6 py-3 text-center font-body text-xs tracking-wider transition-colors duration-200 ${
                    item.featured
                      ? "bg-neptune-teal text-black hover:bg-neptune-green"
                      : "border-neptune-blue text-white hover:border-neptune-teal hover:text-neptune-teal"
                  }`}
                >
                  {item.ctaLabel || "VIEW"}
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
