'use client';

import { useRecoilValue } from 'recoil';
import { emailState } from '@/lib/recoil';

import TokenUsage from './TokenUsage';
import ModelSelect from './ModelSelect';

export default function SidePanel() {
  const email = useRecoilValue(emailState);

  return (
    <div className="flex flex-col items-center justify-between h-screen px-6 py-12 bg-gray-800 text-white">

      <TokenUsage />
      
      <ModelSelect />
      
      <div className="flex flex-col gap-4">
        <p className="text-gray-300" suppressHydrationWarning>
          {email}
        </p>
      </div>
    </div>
  );
}