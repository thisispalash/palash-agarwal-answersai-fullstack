'use client';

import { z } from 'zod';
import axios from 'axios';
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
  email: z.string().email()
});

export default function EmailInput({ shouldExist, onSuccess }: EnterEmailProps) {
  const [ isSending, setIsSending ] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSending(true);

    let code;

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, data);
      code = res.status;
    } catch (err: any) {
      code = err.response.status;
    } finally {
      if (shouldExist) {
        if (code === 200) {
          onSuccess(data.email);
        } else {
          form.setError('email', { message: 'Email not found' });
        }
      } else {
        if (code === 404) {
          onSuccess(data.email);
        } else {
          form.setError('email', { message: 'Email already exists' });
          /// @todo: add a link to login
        }
      }
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