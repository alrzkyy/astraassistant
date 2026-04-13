// ============================================
// AstraAssistant — Root Layout
// ============================================

import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AstraAssistant — Premium AI Chat Platform',
  description:
    'AstraAssistant is a multi-model AI chat platform featuring Claude 3, GPT-3, and Blackbox AI. Chat, search anime & films, upload images, and more.',
  keywords: ['AI', 'chat', 'Claude', 'GPT', 'Blackbox', 'anime', 'assistant'],
  authors: [{ name: 'AstraAssistant' }],
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'AstraAssistant — Premium AI Chat Platform',
    description: 'Multi-model AI chat with Claude 3, GPT-3, and Blackbox AI.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
