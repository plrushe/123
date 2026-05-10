import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
