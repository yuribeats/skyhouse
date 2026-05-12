"use client";

interface ScrollingPoemsProps {
  poems: string[];
  speed?: number;
  height?: number;
}

export default function ScrollingPoems({
  poems,
  speed = 80,
  height = 28,
}: ScrollingPoemsProps) {
  const line = poems.join("  ·  ");
  const content = `${line}  ·  `;

  return (
    <div
      className="overflow-hidden bg-[var(--tas-bg)] text-[var(--tas-fg)]"
      style={{ height: `${height}px`, lineHeight: `${height}px` }}
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animationName: "banner-shift-right",
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          willChange: "transform",
          transform: "translate3d(0,0,0)",
          backfaceVisibility: "hidden",
          ["--banner-shift" as string]: "50%",
        }}
      >
        <span className="shrink-0 px-2 font-body text-[11px] tracking-[0.25em] uppercase">
          {content.repeat(8)}
        </span>
        <span className="shrink-0 px-2 font-body text-[11px] tracking-[0.25em] uppercase" aria-hidden="true">
          {content.repeat(8)}
        </span>
      </div>
    </div>
  );
}
