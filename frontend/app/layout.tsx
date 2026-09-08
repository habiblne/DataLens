import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://datalens-frontend-steel.vercel.app"),
  title: "DataLens — AI CSV Analysis & Insights",
  description: "Ask your data anything. AI-powered CSV analysis with instant answers, charts, and insights.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  openGraph: {
    title: "DataLens — AI CSV Analysis & Insights",
    description: "Ask your data anything. AI-powered CSV analysis with instant answers, charts, and insights.",
    url: "https://datalens-frontend-steel.vercel.app",
    siteName: "DataLens",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DataLens — AI CSV Analysis & Insights"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "DataLens — AI CSV Analysis & Insights",
    description: "Ask your data anything. AI-powered CSV analysis with instant answers, charts, and insights.",
    images: ["/og-image.png"]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DataLens"
  }
};

export const viewport: Viewport = {
  themeColor: "#030712",
  colorScheme: "dark"
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
