"use client";

import Image from "next/image";

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
  // Repeat enough times to guarantee seamless wrap
  const repeated = [...images, ...images, ...images, ...images];

  return (
    <div className="overflow-hidden">
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `scroll-${direction} ${speed}s linear infinite`,
        }}
      >
        {repeated.map((src, i) => (
          <Image
            key={`${src}-${i}`}
            src={src}
            alt=""
            width={480}
            height={270}
            className="flex-shrink-0 w-auto"
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
    </div>
  );
}
