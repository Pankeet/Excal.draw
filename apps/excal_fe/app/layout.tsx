import type { Metadata } from "next";
import Header from "@/app/components/header"
import "./globals.css";

export const metadata: Metadata = {
  title: "Excal.com",
  description: "Curated by Next Devs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        {children}</body>
    </html>
  );
}
