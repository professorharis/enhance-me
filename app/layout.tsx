import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Free Background Remover & AI Photo Editor - Enhance Me",
  description: "Remove backgrounds instantly, resize images, convert to PDF, edit photos with AI. 100% free, no watermarks. Professional quality in seconds.",
  keywords: [
    'Free Background Remover',
    'Image Resizer',
    'Convert Image to PDF',
    'AI Photo Editor',
    'photo editing',
    'background removal',
    'image processing',
    'online photo editor',
    'transparent background',
     'passport size image tool',
     'online passport size for pakistan india free',
    'AI tools'
  ],
  authors: [{ name: 'Enhance Me' }],
  creator: 'Enhance Me',
  publisher: 'Enhance Me',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Free Background Remover & AI Photo Editor - Enhance Me',
    description: 'Remove backgrounds instantly with AI. Resize, convert, edit photos for free. Professional quality in seconds.',
    url: 'https://enhanceme.com',
    siteName: 'Enhance Me',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Enhance Me - Professional Image Editing Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Background Remover & AI Photo Editor - Enhance Me',
    description: 'Remove backgrounds instantly with AI. Professional photo editing tools.',
    images: ['/twitter-image.png'],
    creator: '@enhanceme',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  // Extra metadata for better SEO
  metadataBase: new URL('https://enhanceme.com'),
  alternates: {
    canonical: '/',
  },
  category: 'Image Editing Tools',
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
        {children}
      </body>
    </html>
  );
}