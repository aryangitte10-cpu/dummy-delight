import type { Metadata } from "next";
import "./globals.css";
import { AmplifyProvider } from "../components/amplify-provider";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Impact Board | Connect, Learn & Grow Sustainably",
  description: "Discover sustainability events, connect with expert organizers, and accelerate your journey towards a more sustainable future.",
  keywords: "sustainability, events, coaching, green living, environment, eco-friendly",
  openGraph: {
    title: "Impact Board | Connect, Learn & Grow Sustainably",
    description: "Discover sustainability events and connect with expert organizers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <AmplifyProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AmplifyProvider>
        <Toaster />
      </body>
    </html>
  );
}
