'use client';

import { useEffect, useState } from 'react';
import { RecoilRoot }  from 'recoil';
import { Inter } from 'next/font/google';
import './globals.css';

import { pingServer } from '@/lib/axios';

import ThemeProvider from '@/component/theme-provider';
import { Toaster } from '@/component/shadcn/ui/toaster';
import { useToast } from '@/component/shadcn/ui/use-toast';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { toast } = useToast();
  const [ serverResponsive, setServerResponsive ] = useState<boolean>(false);

  const ping = async () => {
    const pinged = await pingServer();
    if (!pinged) {
      toast({
        title: 'Unresponsive server',
        description: 'Trying again in 5 seconds. Or you may reload the page.',
        duration: 5000,
        variant: 'destructive'
      });
      setTimeout(ping, 5000);
      return;
    }
    setServerResponsive(true);
  }

  useEffect(() => {
    if (!serverResponsive) ping();
  }, [serverResponsive]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <html lang='en'>
      <RecoilRoot>
        <body className={inter.className}>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            disableTransitionOnChange
          >
            {serverResponsive && children}
            {!serverResponsive && (
              <main className='flex min-h-screen flex-col items-center justify-center p-24 gap-8'>
                <div className='flex flex-col items-center text-xl'>
                  Server is unresponsive. Please wait..
                </div>
              </main>
            
            )}
          </ThemeProvider>
          <Toaster />
        </body>
      </RecoilRoot>
    </html>
  );
}
