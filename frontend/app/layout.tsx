import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataLens",
  description: "AI-powered CSV analysis with instant answers, charts, and insights.",
  openGraph: {
    title: "DataLens",
    description: "AI-powered CSV analysis with instant answers, charts, and insights.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark selection:bg-emerald-500/30 selection:text-white">
      <body className="min-h-screen bg-[#030712] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
