'use client';

import { z } from 'zod';
import axios from 'axios';
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
import SubmitBtn from '../btn/SubmitBtn';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export default function EnterPassword({ email, onSuccess }: EnterPasswordProps) {
  const [ isSending, setIsSending ] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: email, password: '' }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSending(true);

    try {
      const hashed = await bcrypt.hash(data.password, 10);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`, 
        { email, password: hashed } /// @dev: email may be edited in Inspect Element below, so we use from props
      );
      if (res.status === 201) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
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