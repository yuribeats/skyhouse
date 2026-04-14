interface EventRowProps {
  date: string;
  city: string;
  venue: string;
  country: string;
  status: "available" | "sold-out" | "announced";
  ticketUrl: string;
}

const statusStyles = {
  available:
    "bg-neptune-teal/20 text-neptune-teal border border-neptune-teal/40",
  "sold-out": "bg-white/10 text-neptune-muted line-through",
  announced: "bg-neptune-blue/20 text-neptune-mid",
};

const statusLabels = {
  available: "AVAILABLE",
  "sold-out": "SOLD OUT",
  announced: "ANNOUNCED",
};

export default function EventRow({
  date,
  city,
  venue,
  country,
  status,
  ticketUrl,
}: EventRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-neptune-blue/30 py-6 md:flex-row md:items-center md:justify-between md:gap-6">
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
        <span className="font-body text-sm tracking-wider text-neptune-muted md:w-[140px]">
          {date}
        </span>
        <span className="font-body text-base text-white">
          {city} — {venue}
        </span>
        <span className="font-body text-xs tracking-wider text-neptune-muted">
          {country}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`inline-block px-3 py-1 font-body text-xs tracking-wider ${statusStyles[status]}`}
        >
          {statusLabels[status]}
        </span>
        {status !== "sold-out" && (
          <a
            href={ticketUrl}
            className="border border-neptune-blue px-5 py-2 font-body text-xs tracking-wider text-white transition-colors duration-200 hover:border-neptune-teal hover:text-neptune-teal"
          >
            TICKETS
          </a>
        )}
      </div>
    </div>
  );
}
