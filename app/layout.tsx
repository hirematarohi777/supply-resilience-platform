import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MST — Mission-Sustainability Twin | Predictive Logistics Decision Platform",
  description: "MST is a B2B SaaS platform for predictive logistics and supply chain decision support. Uncertainty-aware inventory, demand forecasting, dependency graphs, and human-in-the-loop approvals.",
  keywords: ["predictive logistics", "supply chain SaaS", "inventory management", "demand forecasting", "mission sustainability", "decision support"],
  authors: [{ name: "MST Platform" }],
  openGraph: {
    title: "MST — Mission-Sustainability Twin",
    description: "Predictive logistics and forward supply chain decision-support platform.",
    type: "website",
  },
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
