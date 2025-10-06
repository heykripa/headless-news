import type { Metadata } from "next";
import { Noto_Sans_Kannada } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const notoSansKannada = Noto_Sans_Kannada({
  variable: "--font-noto-sans-kannada",
  subsets: ["kannada"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NewsKarnataka | Kannada",
  description: "Updated Kannada News from NewsKarnataka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${notoSansKannada.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
