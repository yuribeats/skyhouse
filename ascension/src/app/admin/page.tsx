"use client";

import { useEffect, useState, useCallback } from "react";

const ADMIN_PASS = "bigvibessss";

function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("admin_auth") === "1") {
      setAuthed(true);
    }
  }, []);

  if (authed) return <>{children}</>;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input === ADMIN_PASS) {
            sessionStorage.setItem("admin_auth", "1");
            setAuthed(true);
          }
        }}
        className="flex gap-2"
      >
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="PASSWORD"
          className="border border-neptune-blue/40 bg-transparent px-4 py-3 font-body text-sm tracking-wider text-white outline-none focus:border-neptune-teal"
        />
        <button type="submit" className="bg-neptune-blue px-6 py-3 font-body text-sm tracking-wider text-white hover:bg-neptune-teal">
          ENTER
        </button>
      </form>
    </div>
  );
}

type Tab = "events" | "shop" | "images" | "contacts" | "subscribers" | "mint";

interface EventItem {
  id: string; name: string; date: string; startTime: string; city: string; venue: string;
  country: string; status: string; ticketUrl: string;
}
interface ShopItem {
  id: string; name: string; price: string; description: string;
  category: string; ctaLabel: string; ctaUrl: string; featured: boolean;
}
interface ImageItem { id: string; url: string; alt: string; }
interface ContactItem {
  id: string; name: string; email: string; organization: string;
  eventType: string; message: string; date: string;
}

const tabs: { key: Tab; label: string }[] = [
  { key: "events", label: "EVENTS" },
  { key: "shop", label: "SHOP" },
  { key: "images", label: "IMAGES" },
  { key: "contacts", label: "INQUIRIES" },
  { key: "subscribers", label: "SUBSCRIBERS" },
  { key: "mint", label: "MINT" },
];

const inputClass =
  "w-full border border-neptune-blue/40 bg-black px-3 py-2 font-body text-sm text-white outline-none focus:border-neptune-teal";
const btnClass =
  "bg-neptune-blue px-4 py-2 font-body text-xs tracking-wider text-white hover:bg-neptune-teal";
const delClass =
  "bg-red-800 px-3 py-1 font-body text-xs text-white hover:bg-red-600";

export default function Admin() {
  const [tab, setTab] = useState<Tab>("events");

  return (
    <AuthGate>
    <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-12">
      <h1 className="mb-8 font-body text-2xl font-bold tracking-wider text-white">
        ADMIN
      </h1>

      <div className="mb-8 flex gap-1 border-b border-neptune-blue/30">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-3 font-body text-xs tracking-wider transition-colors ${
              tab === t.key
                ? "border-b-2 border-neptune-teal text-neptune-teal"
                : "text-neptune-muted hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "events" && <EventsPanel />}
      {tab === "shop" && <ShopPanel />}
      {tab === "images" && <ImagesPanel />}
      {tab === "contacts" && <ContactsPanel />}
      {tab === "subscribers" && <SubscribersPanel />}
      {tab === "mint" && (
        <div className="relative" style={{ height: "calc(100vh - 200px)" }}>
          <iframe
            src="https://neptune.christmas/process"
            className="h-full w-full border-0"
            allow="clipboard-write"
          />
        </div>
      )}
    </div>
    </AuthGate>
  );
}

const emptyEvent = { id: "", name: "", date: "", startTime: "", city: "", venue: "", country: "", status: "announced", ticketUrl: "" };

function EventsPanel() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [form, setForm] = useState<EventItem>(emptyEvent);

  const load = useCallback(() => {
    fetch("/api/events").then((r) => r.json()).then(setItems);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    const payload = form.id ? form : { ...form, id: undefined };
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setForm(emptyEvent);
    load();
  };

  const edit = (e: EventItem) => {
    setForm({
      id: e.id,
      name: e.name || "",
      date: e.date || "",
      startTime: e.startTime || "",
      city: e.city || "",
      venue: e.venue || "",
      country: e.country || "",
      status: e.status || "announced",
      ticketUrl: e.ticketUrl || "",
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = async (id: string) => {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "delete", id }),
    });
    if (form.id === id) setForm(emptyEvent);
    load();
  };

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <input className={inputClass} placeholder="EVENT NAME" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={inputClass} placeholder="DATE" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input className={inputClass} placeholder="START TIME" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
        <input className={inputClass} placeholder="CITY" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input className={inputClass} placeholder="VENUE" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
        <input className={inputClass} placeholder="COUNTRY" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="announced">ANNOUNCED</option>
          <option value="available">AVAILABLE</option>
          <option value="sold-out">SOLD OUT</option>
        </select>
        <input className={inputClass} placeholder="TICKET URL" value={form.ticketUrl} onChange={(e) => setForm({ ...form, ticketUrl: e.target.value })} />
        <button onClick={save} className={btnClass}>{form.id ? "UPDATE EVENT" : "ADD EVENT"}</button>
        {form.id && (
          <button onClick={() => setForm(emptyEvent)} className={btnClass}>CANCEL</button>
        )}
      </div>
      <div className="space-y-2">
        {items.map((e) => (
          <div key={e.id} className="flex items-center justify-between border border-neptune-blue/20 px-4 py-3">
            <span className="font-body text-sm text-white">
              {e.name && <span className="text-orange-400">{e.name} — </span>}
              {e.date}{e.startTime ? ` ${e.startTime}` : ""} — {e.city}, {e.venue} ({e.country}) [{e.status}]
            </span>
            <div className="flex gap-2">
              <button onClick={() => edit(e)} className={btnClass}>EDIT</button>
              <button onClick={() => del(e.id)} className={delClass}>DELETE</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-neptune-muted">NO EVENTS</p>}
      </div>
    </div>
  );
}

function ShopPanel() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [form, setForm] = useState({ name: "", price: "", description: "", category: "", ctaLabel: "", ctaUrl: "", featured: false });

  const load = useCallback(() => {
    fetch("/api/shop").then((r) => r.json()).then(setItems);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    await fetch("/api/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", price: "", description: "", category: "", ctaLabel: "", ctaUrl: "", featured: false });
    load();
  };

  const del = async (id: string) => {
    await fetch("/api/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "delete", id }),
    });
    load();
  };

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        <input className={inputClass} placeholder="NAME" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={inputClass} placeholder="PRICE" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className={inputClass} placeholder="CATEGORY" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className={inputClass} placeholder="CTA LABEL" value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} />
        <input className={inputClass} placeholder="CTA URL" value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} />
        <label className="flex items-center gap-2 font-body text-sm text-white">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          FEATURED
        </label>
        <textarea className={inputClass} placeholder="DESCRIPTION" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
        <button onClick={save} className={btnClass}>ADD ITEM</button>
      </div>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between border border-neptune-blue/20 px-4 py-3">
            <span className="font-body text-sm text-white">
              {i.name} — {i.price} [{i.category}]
            </span>
            <button onClick={() => del(i.id)} className={delClass}>DELETE</button>
          </div>
        ))}
        {items.length === 0 && <p className="text-neptune-muted">NO ITEMS</p>}
      </div>
    </div>
  );
}

function ImagesPanel() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(() => {
    fetch("/api/images").then((r) => r.json()).then(setItems);
  }, []);
  useEffect(() => { load(); }, [load]);

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", alt);
    await fetch("/api/images", { method: "POST", body: fd });
    setFile(null);
    setAlt("");
    setUploading(false);
    load();
  };

  const del = async (id: string) => {
    await fetch("/api/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "delete", id }),
    });
    load();
  };

  return (
    <div>
      <div className="mb-6 flex gap-3">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="font-body text-sm text-white" />
        <input className={inputClass + " max-w-[200px]"} placeholder="ALT TEXT" value={alt} onChange={(e) => setAlt(e.target.value)} />
        <button onClick={upload} disabled={uploading || !file} className={btnClass}>
          {uploading ? "UPLOADING..." : "UPLOAD"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((img) => (
          <div key={img.id} className="group relative border border-neptune-blue/20">
            <img src={img.url} alt={img.alt} className="h-40 w-full object-cover" />
            <div className="flex items-center justify-between p-2">
              <span className="font-body text-xs text-neptune-muted">{img.alt || "—"}</span>
              <button onClick={() => del(img.id)} className={delClass}>X</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-neptune-muted">NO UPLOADED IMAGES</p>}
      </div>
      <p className="mt-4 font-body text-xs text-neptune-muted">
        NOTE: STATIC IMAGES FROM THE BUILD ARE ON THE IMAGES PAGE AUTOMATICALLY. UPLOADS HERE ADD ADDITIONAL IMAGES.
      </p>
    </div>
  );
}

function ContactsPanel() {
  const [items, setItems] = useState<ContactItem[]>([]);

  const load = useCallback(() => {
    fetch("/api/contacts").then((r) => r.json()).then(setItems);
  }, []);
  useEffect(() => { load(); }, [load]);

  const del = async (id: string) => {
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "delete", id }),
    });
    load();
  };

  return (
    <div className="space-y-4">
      {items.map((c) => (
        <div key={c.id} className="border border-neptune-blue/20 p-4">
          <div className="mb-2 flex justify-between">
            <span className="font-body text-sm font-bold text-white">{c.name} — {c.email}</span>
            <button onClick={() => del(c.id)} className={delClass}>DELETE</button>
          </div>
          <p className="font-body text-xs text-neptune-muted">
            {c.organization && `${c.organization} · `}{c.eventType && `${c.eventType} · `}{new Date(c.date).toLocaleDateString()}
          </p>
          <p className="mt-2 font-body text-sm text-white">{c.message}</p>
        </div>
      ))}
      {items.length === 0 && <p className="text-neptune-muted">NO INQUIRIES</p>}
    </div>
  );
}

function SubscribersPanel() {
  const [subscribers, setSubscribers] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/subscribe").then((r) => r.json()).then((d) => setSubscribers(d.subscribers || []));
  }, []);

  return (
    <div>
      <p className="mb-4 font-body text-sm text-neptune-muted">{subscribers.length} TOTAL</p>
      <div className="space-y-2">
        {subscribers.map((email) => (
          <div key={email} className="border border-neptune-blue/20 px-4 py-3 font-body text-sm text-white">
            {email}
          </div>
        ))}
        {subscribers.length === 0 && <p className="text-neptune-muted">NO SUBSCRIBERS YET</p>}
      </div>
    </div>
  );
}
