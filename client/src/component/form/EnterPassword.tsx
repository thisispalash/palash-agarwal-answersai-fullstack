'use client';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
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
import SubmitBtn from '../btn/SubmitBtn';

import { registerUser } from '@/lib/axios';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export default function EnterPassword({ email, onSuccess }: EnterPasswordProps) {
  const [ isSending, setIsSending ] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: email, password: '' }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSending(true);

    const password = await bcrypt.hash(data.password, 10);
    const registered = await registerUser(data.email, password);

    if (registered) {
      onSuccess();
    } else {
      toast({
        title: `Registration Failed`,
        description: `Email ${data.email} not registered. Please try again.`,
        variant: 'destructive'
      });
    }

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
  email: string;
  onSuccess: () => void;
};