'use client';

import { useRecoilValue } from 'recoil';
import { emailState } from '@/lib/recoil';

export default function SidePanel() {
  const email = useRecoilValue(emailState);

  return (
    <div className="flex flex-col items-center justify-between h-screen p-4 bg-gray-800 text-white gap-6">

      
      
      <div className="flex flex-col gap-4">
        <p className="text-gray-300" suppressHydrationWarning>
          {email}
        </p>
      </div>
    </div>
  );
}