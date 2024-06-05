'use client';

import dynamic from 'next/dynamic';

// import SidePanel from '@/component/chat/SidePanel';

const SidePanel = dynamic(() => import('@/component/chat/SidePanel'), { ssr: false });

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-row items-center justify-center">
      <div className="w-1/4">
        <SidePanel />
      </div>
      <div className="w-3/4">
        {children}
      </div>
    </main>
  );
}