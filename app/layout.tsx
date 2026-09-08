import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SceneScout — Autonomous Production Intelligence Agent',
  description: 'Your AI production scout. Turn a scene brief into a research-backed filming location shortlist with live Parallel Search and Gemini intelligence.',
  keywords: ['film production', 'location scouting', 'agentic cinema', 'AI agent', 'Parallel Search', 'Gemini'],
  authors: [{ name: 'SceneScout Hackathon Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
