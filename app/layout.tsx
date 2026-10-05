import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MailMeWhen 🎯',
  description: 'Get notified when memecoins hit your target market cap',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}