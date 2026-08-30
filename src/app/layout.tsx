import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Tenor_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const tenorSans = Tenor_Sans({
  variable: "--font-tenorsans",
  weight: "400",
  subsets: ["latin"],
});

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
