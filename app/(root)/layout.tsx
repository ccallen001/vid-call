import { ReactNode } from 'react';
import { Metadata } from 'next';
import StreamVideoProvider from '@/providers/StreamClientProvider';

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Vid Call',
  description: 'Video calling made fun!',
  icons: {
    icon: '/icons/logo.svg',
  },
};

function RootLayout({ children }: RootLayoutProps) {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
}

export default RootLayout;
