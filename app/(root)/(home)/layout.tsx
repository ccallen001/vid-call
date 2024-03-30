import { ReactNode } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

interface HomeLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Vid Call',
  description: 'Video calling made fun!',
  icons: {
    icon: '/icons/logo.svg',
  },
};

function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <main className="relative">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  );
}

export default HomeLayout;
