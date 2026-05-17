import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumen AI Surface — Phase 5 Reference",
  description:
    "Reference implementation of the Lumen v0.13 AI surface — chat-thread, lane-search, shipment-timeline, quote-builder, agent-approval-flow, command-palette flows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
