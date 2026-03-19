import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
      <body
        className={`${inter.variable} ${jetBrainsMono.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
