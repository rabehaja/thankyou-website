import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./encre.css";

const abramo = localFont({
  src: "../fonts/abramo.woff2",
  variable: "--font-abramo",
  display: "swap",
});

const london = localFont({
  src: "../fonts/london.woff2",
  variable: "--font-london",
  display: "swap",
});

const montserrat = localFont({ src: "../fonts/london.woff2", variable: "--font-montserrat", display: "swap" });

const playfair = localFont({ src: "../fonts/london.woff2", variable: "--font-playfair", display: "swap" });

const tenorSans = localFont({ src: "../fonts/london.woff2", variable: "--font-tenorsans", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Ever After — Thank You",
    template: "%s · Ever After",
  },
  description:
    "A heartfelt thank you from the newlyweds — memories, photographs and personal notes for our loved ones.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${abramo.variable} ${london.variable} ${montserrat.variable} ${playfair.variable} ${tenorSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
