import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "All Hands · XD Latam",
  description: "All Hands presentation — XD Latam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${lexend.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--latam-offwhite)] text-[var(--latam-black)]">
        {children}
      </body>
    </html>
  );
}
