import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

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
      <body className="flex min-h-full flex-col font-body">
        <ThemeProvider>
          <Nav />
          <main className="flex-1 pt-[96px]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
