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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
