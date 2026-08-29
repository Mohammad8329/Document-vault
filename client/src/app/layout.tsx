import type { Metadata } from 'next';
import './globals.css';
import { ApolloWrapper } from '@/graphql/ApolloWrapper';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'Document Vault — Secure Knowledge & Document Hub',
  description: 'A modern, high-performance GraphQL document management platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ApolloWrapper>
            <div className="ambient-glow" aria-hidden="true" />
            <div className="app-layout">{children}</div>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
