'use client';

import { useRecoilValue } from 'recoil';
import { emailState } from '@/lib/recoil';

import TokenUsage from './TokenUsage';

export default function SidePanel() {
  const email = useRecoilValue(emailState);

  return (
    <div className="fixed left-0 top-0 w-1/4 flex flex-col items-center justify-between h-screen px-6 py-12 bg-gray-800 text-white">

      <TokenUsage />
      
      <div className="flex flex-col gap-4">
        <p className="text-gray-300" suppressHydrationWarning>
          {email}
        </p>
      </div>
    </div>
  );
}