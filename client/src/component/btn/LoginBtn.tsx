'use client';

import { useRouter } from 'next/navigation';

import { Button } from '../shadcn/ui/button';

export default function LoginBtn() {
  const router = useRouter();

  return (
    <Button 
      variant='outline' 
      onClick={() => router.push('/login')}
    >
      Login
    </Button>
  );
}