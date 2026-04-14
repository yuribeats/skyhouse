"use client";

import { useState } from "react";
import Image from "next/image";

interface Photo {
  src: string;
  alt: string;
}

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <>
      <div className="columns-2 gap-4 md:columns-3">
        {photos.map((photo) => (
          <button
            key={photo.src}
            onClick={() => setSelected(photo)}
            className="group mb-4 block w-full break-inside-avoid border border-transparent transition-all duration-200 hover:scale-[1.02] hover:border-neptune-blue"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={600}
              className="h-auto w-full"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelected(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
          role="dialog"
          tabIndex={0}
        >
          <Image
            src={selected.src}
            alt={selected.alt}
            width={1600}
            height={1200}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </>
  );
}
