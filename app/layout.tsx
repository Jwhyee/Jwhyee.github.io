import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "가준영 | Backend Engineer Portfolio",
  description: "Senior Backend Developer Portfolio optimized for A4 Portrait PDF Export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
