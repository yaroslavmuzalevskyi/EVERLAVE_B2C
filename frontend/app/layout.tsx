import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ScrollReveal from "@/components/ui/ScrollReveal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evervale B2C | Professional Cannabis Genetics",
  description:
    "Professional F1 autoflower seeds for licensed businesses. GACP certification. Delivery throughout Europe.",
  icons: {
    icon: "/tab_logo.svg",
    shortcut: "/tab_logo.svg",
    apple: "/tab_logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ScrollReveal />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
