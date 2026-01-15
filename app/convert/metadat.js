// app/convert/metadata.js
export const metadata = {
  title: "Free File Converter - Convert 18+ Formats Online | Enhance Me",
  description: "Convert PDF, DOCX, JPG, PNG and 14+ other formats instantly. 100% free online file converter with privacy-first local processing. No watermarks.",
  keywords: [
    'free file converter',
    'PDF to Word converter',
    'image converter',
    'DOCX to PDF',
    'JPG to PNG',
    'online file conversion',
    'document converter',
    'Enhance Me converter',
    '18+ format converter',
    'privacy-first converter'
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
    title: 'Free File Converter - Convert 18+ Formats Online | Enhance Me',
    description: 'Convert PDF, DOCX, JPG, PNG and 14+ other formats instantly. Privacy-first local processing.',
    url: 'https://enhanceme.com/convert',
    siteName: 'Enhance Me',
    images: [
      {
        url: '/og-convert.png',
        width: 1200,
        height: 630,
        alt: 'Enhance Me File Converter - Convert 18+ Formats',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free File Converter - Convert 18+ Formats Online | Enhance Me',
    description: 'Convert PDF, DOCX, JPG, PNG and 14+ other formats instantly. Privacy-first local processing.',
    images: ['/twitter-convert.png'],
    creator: '@enhanceme',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: '/convert',
  },
  category: 'File Conversion Tools',
};