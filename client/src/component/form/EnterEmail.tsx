'use client';

import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '../shadcn/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from '../shadcn/ui/form';
import { useToast } from '../shadcn/ui/use-toast';
import RegisterBtn from '../btn/RegisterBtn';
import SubmitBtn from '../btn/SubmitBtn';
import LoginBtn from '../btn/LoginBtn';

import { checkUser } from '@/lib/axios';

const formSchema = z.object({
  email: z.string().email()
});

export default function EmailInput({ shouldExist, onSuccess }: EnterEmailProps) {
  const [ isSending, setIsSending ] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSending(true);

    const email = data.email.toLowerCase();
    const exists = await checkUser(email);

    if (shouldExist && !exists) {
      toast({
        title: `Please Register`,
        description: `Email ${email} not found. Please use a different email, or register.`,
        variant: 'destructive',
        action: <RegisterBtn />
      });
      return setIsSending(false);
    } else if (!shouldExist && exists) {
      toast({
        title: `Please Login`,
        description: `Email ${email} already exists. Please use a different email, or login.`,
        variant: 'destructive',
        action: <LoginBtn />
      });
      return setIsSending(false);
    }

    onSuccess(data.email);
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
                    placeholder="email@example.com"
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

type EnterEmailProps = {
  shouldExist: boolean;
  onSuccess: (email: string) => void;
};