'use client';

import { useRouter } from 'next/navigation';

import { Button } from '../shadcn/ui/button';

export default function RegisterBtn() {
  const router = useRouter();
  
  return (
    <Button 
      variant='outline' 
      onClick={() => router.push('/register')}
    >
      Register
    </Button>
  );
}