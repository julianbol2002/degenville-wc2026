import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Degenville World Cup 2026",
  description: "ESPN-style World Cup 2026 bracket, leaderboard, and picks tracker for Degenville.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
