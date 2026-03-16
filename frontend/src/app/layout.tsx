import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Ethiopian Salary Predictor | ML-Powered Salary Insights',
  description: 'Predict tech salaries in Ethiopia using machine learning. Get accurate salary estimates based on experience, education, and location.',
  keywords: 'Ethiopia, salary prediction, tech jobs, machine learning, career planning',
  authors: [{ name: 'Ethiopian Tech Salary ML Team' }],
  openGraph: {
    title: 'Ethiopian Salary Predictor',
    description: 'ML-powered salary prediction for Ethiopian tech professionals',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ethiopian Salary Predictor',
    description: 'ML-powered salary prediction for Ethiopian tech professionals',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-gray-50">
        <div className="min-h-screen">
          {children}
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}