'use client';

import { useState } from 'react';

import EnterEmail from '@/component/form/EnterEmail';
import EnterPassword from '@/component/form/EnterPassword';

export default function LoginPage() {
  const [ step, setStep ] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">

      {step === 0 && 
        <EnterEmail 
          shouldExist={true} 
          onSuccess={() => setStep(1)}
        />
      }

      {step === 1 &&
        <EnterPassword
          caller='login'
          onSuccess={() => window.open('/chat', '_self')}
        />
      }

    </main>
  )
}