import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ExamPocket | Study Materials for AKTU, ABES EC, AKGEC & KIET",
    template: "%s | ExamPocket",
  },
  description:
    "Your one-stop destination for AKTU, ABES EC, AKGEC, and KIET study materials. Access chapter-wise notes, subject notes, and previous year questions.",
  keywords: [
    "AKTU notes",
    "ABES EC notes",
    "AKGEC notes",
    "KIET notes",
    "engineering notes",
    "previous year questions",
    "PYQ",
    "study materials",
    "semester notes",
  ],
  authors: [{ name: "ExamPocket" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://exampocket.vercel.app",
    siteName: "ExamPocket",
    title: "ExamPocket | Study Materials for AKTU, ABES EC, AKGEC & KIET",
    description:
      "Access free study materials, notes, and previous year questions for engineering students.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExamPocket | Study Materials",
    description:
      "Free engineering study materials, notes, and PYQs for AKTU affiliated colleges.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="bottom-right" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
