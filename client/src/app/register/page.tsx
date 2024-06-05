'use client';

import { useState } from 'react';

import LoginBtn from '@/component/btn/LoginBtn';
import EnterEmail from '@/component/form/EnterEmail';
import EnterPassword from '@/component/form/EnterPassword';

export default function RegisterPage() {
  const [ step, setStep ] = useState(0);
  const [ email, setEmail ] = useState(''); /// @todo: this should be managed with `recoil`

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">

      {step === 0 && 
        <EnterEmail 
          shouldExist={false} 
          onSuccess={
            (email: string) => {
              setEmail(email);
              setStep(1);
            }
          }
        />
      }

      {step === 1 &&
        <EnterPassword
          email={email}
          onSuccess={() => setStep(2)}
        />
      }

      {step === 2 &&
        <div className="flex flex-col gap-4 text-lg">
          <p className="text-lg">
            Congratulations! You have successfully registered. Please login.
          </p>
          <LoginBtn />
        </div>
      }

    </main>
  );
}