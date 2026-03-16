import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio | Web Developer & Game Developer",
  description:
    "Junior developer specializing in Next.js web development and Unity game development. Explore my interactive portfolio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
