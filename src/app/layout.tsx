import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Kannada } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKannada.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
