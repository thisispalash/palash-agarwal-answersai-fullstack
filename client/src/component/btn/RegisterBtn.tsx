'use client';

import { Button } from '../shadcn/ui/button';

export default function RegisterBtn() {
  return (
    <Button 
      variant='outline' 
      onClick={() => window.open('/register', '_self')}
    >
      Register
    </Button>
  );
}