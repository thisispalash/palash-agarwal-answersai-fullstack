'use client';

import { useEffect } from 'react';

import LoginBtn from '@/component/btn/LoginBtn';
import RegisterBtn from '@/component/btn/RegisterBtn';

export default function Home() {

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session') || '{}');
    if (session.exp && session.exp > Date.now()) {
      window.location.href = '/chat';
    }
  }, []);

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
