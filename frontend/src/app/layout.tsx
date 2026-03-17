import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Ethiopian Salary Predictor | ML-Powered Salary Insights',
  description: 'Predict tech salaries in Ethiopia using machine learning. Get accurate salary estimates based on experience, education, and location with 86% accuracy.',
  keywords: 'Ethiopia, salary prediction, tech jobs, machine learning, career planning, Addis Ababa, tech salaries, ML prediction',
  authors: [{ name: 'Ethiopian Tech Salary ML Team' }],
  creator: 'Ethiopian Tech Salary ML',
  publisher: 'Ethiopian Tech Salary ML',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ethiopiansalary.ml'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ethiopian Salary Predictor | ML-Powered Salary Insights',
    description: 'Predict tech salaries in Ethiopia using machine learning. Get accurate salary estimates based on experience, education, and location.',
    type: 'website',
    locale: 'en_US',
    url: 'https://ethiopiansalary.ml',
    siteName: 'Ethiopian Salary Predictor',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ethiopian Salary Predictor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ethiopian Salary Predictor',
    description: 'ML-powered salary prediction for Ethiopian tech professionals',
    creator: '@ethiopiansalary',
    images: ['/twitter-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-gray-50 dark:bg-dark-950 text-gray-900 dark:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
