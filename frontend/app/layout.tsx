import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GnosisChallenge",
  description: "Challenge for Gnosis!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
