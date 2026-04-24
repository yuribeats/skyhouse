"use client";

interface ScrollingBannerProps {
  images: string[];
  direction?: "left" | "right";
  speed?: number;
  height?: number;
}

export default function ScrollingBanner({
  images,
  direction = "left",
  speed = 40,
  height = 200,
}: ScrollingBannerProps) {
  const imgWidth = Math.round((height * 16) / 9);
  const setWidth = imgWidth * images.length;

  return (
    <div className="overflow-hidden" style={{ height: `${height}px` }}>
      <div
        className="flex"
        style={{
          width: `${setWidth * 2}px`,
          animationName: direction === "left" ? "banner-shift-left" : "banner-shift-right",
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          willChange: "transform",
          transform: "translate3d(0,0,0)",
          backfaceVisibility: "hidden",
          ["--banner-shift" as string]: `${setWidth}px`,
        }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex flex-shrink-0"
            style={{ width: `${setWidth}px` }}
            aria-hidden={copy === 1}
          >
            {images.map((src, i) => (
              <img
                key={`${copy}-${i}`}
                src={src}
                alt=""
                width={imgWidth}
                height={height}
                style={{
                  width: `${imgWidth}px`,
                  height: `${height}px`,
                  display: "block",
                  flexShrink: 0,
                }}
                draggable={false}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
