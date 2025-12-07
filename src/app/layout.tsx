import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AmplifyProvider } from "../components/amplify-provider";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Impact Board",
  description: "Impact Board",
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
        <AmplifyProvider>
          <Header />
          {children}
        </AmplifyProvider>
        <Toaster />
      </body>
    </html>
  );
}
