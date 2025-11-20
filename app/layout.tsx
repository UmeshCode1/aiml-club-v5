import { Inter, Space_Grotesk } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'AI & ML Club - Oriental College of Technology',
  description: 'Official website of AI & Machine Learning Club at Oriental College of Technology, Bhopal. Innovate • Implement • Inspire',
  keywords: ['AI', 'Machine Learning', 'OCT', 'Bhopal', 'Student Club', 'Technology'],
  authors: [{ name: 'AIML Club OCT' }],
  // Provides absolute base for Open Graph/Twitter image and canonical URL resolution
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aimlcluboct.vercel.app'),
  openGraph: {
    title: 'AI & ML Club - OCT Bhopal',
    description: 'Innovate • Implement • Inspire',
    url: 'https://aimlcluboct.vercel.app',
    siteName: 'AIML Club OCT',
    images: [
      {
        url: '/images/logo aiml.png',
        width: 1200,
        height: 630,
        alt: 'AIML Club OCT',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI & ML Club - OCT Bhopal',
    description: 'Innovate • Implement • Inspire',
    images: ['/images/logo aiml.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
