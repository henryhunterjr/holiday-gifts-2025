import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Holiday Gift Guide",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/gifts/">Gift Guide</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
