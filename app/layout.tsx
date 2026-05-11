import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeachBoard | ESL Jobs Platform",
  description: "Discover and hire top ESL teaching talent worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f8f2e8]">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
