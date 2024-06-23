'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import LoginBtn from '@/component/btn/LoginBtn';
import RegisterBtn from '@/component/btn/RegisterBtn';
import { useToast } from '@/component/shadcn/ui/use-toast';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session') || '{}');
    if (session.exp && session.exp > Date.now()) {
      toast({
        title: 'Welcome back!',
        description: 'You are already logged in.',
        duration: 5000,
      })
      router.push('/chat');
    }
  }, [router, toast]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">

      <div className="flex flex-col items-center text-xl">
        Welcome to arbitrary model chat!
      </div>

      <div className="flex flex-row items-center justify-center gap-4">
        <LoginBtn />
        <RegisterBtn />
      </div>
    </main>
  );
}
