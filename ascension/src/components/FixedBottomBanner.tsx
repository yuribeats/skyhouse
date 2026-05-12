"use client";

import ScrollingBanner from "@/components/ScrollingBanner";

const panels = Array.from({ length: 25 }, (_, i) => `/assets/panels/panel-${25 + i}.jpg`);

export default function FixedBottomBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 overflow-hidden bg-black">
      <ScrollingBanner images={panels} direction="left" speed={150} height={56} />
    </div>
  );
}
