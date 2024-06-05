'use client';

import { Button } from '../shadcn/ui/button';

export default function LoginBtn() {
  return (
    <Button 
      variant='outline' 
      onClick={() => window.open('/login', '_self')}
    >
      Login
    </Button>
  );
}