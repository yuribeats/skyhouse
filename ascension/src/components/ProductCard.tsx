interface ProductCardProps {
  name: string;
  price: string;
  description?: string;
  category: string;
  imageAlt?: string;
  ctaLabel: string;
  ctaUrl: string;
  featured?: boolean;
}

// TODO: integrate Stripe or Shopify for shop

export default function ProductCard({
  name,
  price,
  description,
  ctaLabel,
  ctaUrl,
  featured,
}: ProductCardProps) {
  return (
    <div
      className={`flex flex-col gap-4 border p-6 transition-colors duration-200 ${
        featured
          ? "border-neptune-teal bg-[#050505]"
          : "border-neptune-blue/40 bg-[#050505] hover:border-neptune-teal"
      }`}
    >
      <h3 className="font-body text-base tracking-wider text-white">{name}</h3>
      <p className="font-body text-lg text-neptune-teal">{price}</p>
      {description && (
        <p className="font-body text-sm leading-relaxed text-neptune-muted">
          {description}
        </p>
      )}
      <a
        href={ctaUrl}
        className={`mt-auto inline-block border px-6 py-3 text-center font-body text-xs tracking-wider transition-colors duration-200 ${
          featured
            ? "bg-neptune-teal text-black hover:bg-neptune-green"
            : "border-neptune-blue text-white hover:border-neptune-teal hover:text-neptune-teal"
        }`}
      >
        {ctaLabel}
      </a>
    </div>
  );
}
