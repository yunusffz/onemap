import type { Metadata } from "next";
import { Providers } from "./providers";
import { satoshi } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "MapLibre Boilerplate",
  description: "Next.js boilerplate with Tailwind CSS, TanStack Query, and MapLibre GL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={satoshi.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
