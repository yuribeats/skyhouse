import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Ascension Service",
  description:
    "A living ceremony — part performance, part practice, part invitation. Founded by Forrest Mortifee.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-black font-body text-white">
        <Nav />
        <main className="flex-1 pt-[272px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
