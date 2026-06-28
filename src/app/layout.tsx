import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryProvider } from "@/components/QueryProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Degenville | World Cup 2026",
  description: "17 friends. 16 games. One bracket. Who called it?",
  metadataBase: new URL("https://degenville-wc2026.vercel.app"),
  openGraph: {
    title: "Degenville | World Cup 2026 Bracket",
    description: "17 friends. 16 games. One bracket. Who called it?",
    url: "https://degenville-wc2026.vercel.app",
    siteName: "Degenville WC2026",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Degenville World Cup 2026 Bracket Challenge",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Degenville | World Cup 2026 Bracket",
    description: "17 friends. 16 games. One bracket. Who called it?",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('degenville-theme');document.documentElement.classList.toggle('dark',t!=='light');}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="bg-bg font-sans text-primary antialiased transition-colors duration-300">
        <ThemeProvider>
          <QueryProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
