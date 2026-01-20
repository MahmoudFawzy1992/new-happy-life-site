import type { Metadata } from "next";
import { Cairo } from "next/font/google"; // Importing the Arabic font
import "./globals.css";

// Configure Cairo Font
const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"], // Normal, Semi-Bold, Bold
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Happy Life Tourism",
  description: "Travel & Tourism Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* CRITICAL: dir="rtl" and lang="ar" for correct Arabic layout */
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}