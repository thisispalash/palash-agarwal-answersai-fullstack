'use client';

import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRecoilValue } from 'recoil';
import { emailState } from '@/lib/recoil';

import { Input } from '../shadcn/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from '../shadcn/ui/form';
import { useToast } from '../shadcn/ui/use-toast';
import SubmitBtn from '../btn/SubmitBtn';

import { registerUser, loginUser } from '@/lib/axios';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export default function EnterPassword({ onSuccess, caller }: EnterPasswordProps) {
  const [ isSending, setIsSending ] = useState(false);
  const { toast } = useToast();
  const email = useRecoilValue(emailState);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: email, password: '' }
  });

  const registrationFlow = async (_email: string, _password: string) => {
    if (await registerUser(_email, _password)) {
    onSuccess();
    } else {
      toast({
        title: `Registration Failed`,
        description: <p>
          Email <i>{email}</i> not registered. Please try again.
        </p>,
        variant: 'destructive'
      });
    }
  }

  const loginFlow = async (_email: string, _password: string) => {
    const logMessage = await loginUser(_email, _password);
    if (typeof logMessage === 'boolean') {
      onSuccess();
    } else {
      toast({
        title: logMessage,
        description: `Login failed. Please try again.`,
        variant: 'destructive'
      });
    }
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSending(true);

    /// @dev separate functions to avoid multiple nesting
    if (caller === 'login') await loginFlow(email, data.password);
    else await registrationFlow(email, data.password);
    
    setIsSending(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
        
      <p className="text-lg">
        Enter your email
      </p>
      
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <Input 
                    {...field}
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <Input 
                    {...field}
                    id="password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitBtn disabled={isSending} />
        </form>
      </Form>

    </div>
  );
}

type EnterPasswordProps = {
  onSuccess: () => void;
  caller: 'login' | 'register';
};