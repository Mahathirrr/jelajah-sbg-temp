// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AuthSessionProvider from "@/components/providers/SessionProvider";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JelajahSabang - Explore the Beauty of Sabang",
  description: "Discover beautiful destinations, accommodations, and culinary experiences in Sabang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <Navigation />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p>&copy; 2025 JelajahSabang. All rights reserved.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Explore the beauty of Sabang, Indonesia
                </p>
              </div>
            </div>
          </footer>
        </AuthSessionProvider>
      </body>
    </html>
  );
}