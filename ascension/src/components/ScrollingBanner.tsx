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
  // Only need 2 copies for seamless loop — animation shifts exactly one copy width
  const set1 = images;
  const set2 = images;

  return (
    <div className="overflow-hidden">
      <div
        className="flex"
        style={{
          animation: `scroll-${direction} ${speed}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {set1.map((src, i) => (
          <Image
            key={`a-${i}`}
            src={src}
            alt=""
            width={480}
            height={270}
            className="flex-shrink-0 w-auto"
            style={{ height: `${height}px` }}
          />
        ))}
        {set2.map((src, i) => (
          <Image
            key={`b-${i}`}
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
