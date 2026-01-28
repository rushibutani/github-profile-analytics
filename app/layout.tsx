import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Profile Analytics | Developer Insights Dashboard",
  description:
    "Comprehensive GitHub profile analytics with contribution patterns, language statistics, and repository insights. Built for recruiters and developers.",
  keywords: [
    "GitHub",
    "Analytics",
    "Developer Profile",
    "Statistics",
    "Contribution Graph",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
