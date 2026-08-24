import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Karla } from "next/font/google";
import "./globals.css";

// Same families the SPA loads from Google Fonts, self-hosted by next/font.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  variable: "--font-display",
});
const karla = Karla({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Holiday Gift Guide",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${karla.variable}`}>
      <body>
        <nav>
          <Link href="/gifts/">Gift Guide</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
