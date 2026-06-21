import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIADS - Reclame intr-o secunda",
  description: "Platforma AI pentru campanii publicitare automate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" className={cn("font-sans", geist.variable)}>
      <body className={inter.className} style={{ backgroundColor: "#FFF9FA" }}>
        {children}
      </body>
    </html>
  );
}