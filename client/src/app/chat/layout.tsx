'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { emailState, tokenUsageState } from '@/lib/recoil';
import { fetchTokenUsage as fetchUsage } from '@/lib/axios';
import Spinner from '@/component/Spinner';

const SidePanel = dynamic(() => import('@/component/chat/SidePanel'), { ssr: false });

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [ loading, setLoading ] = useState(true);
  const email = useRecoilValue(emailState);
  const setTokenUsage = useSetRecoilState(tokenUsageState);

  const fetchTokenUsage = useCallback(
    async () => {
      const res = await fetchUsage(email);
      if (typeof res === 'object') {
        setTokenUsage(res);
        setLoading(false);
      }
      else {
        /// @todo check for 'Invalid Token' and 'Internal server error'
      }
    }, [email, setTokenUsage]
  );

  useEffect(() => {
    fetchTokenUsage();
  }, [fetchTokenUsage]);


  return (
    <main className="flex h-screen flex-row items-center justify-center">
      {loading && <Spinner />}
      {!loading && <>
        <div className="w-1/4">
          <SidePanel />
        </div>
        <div className="w-3/4">
          {children}
        </div>
      </>}
    </main>
  );
}