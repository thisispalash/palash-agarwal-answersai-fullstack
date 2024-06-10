'use client';

import { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useRouter } from 'next/navigation';

import { 
  emailState, 
  lastPromptState, 
  modelDisplayName, 
  modelState 
} from '@/lib/recoil';
import { startChat } from '@/lib/axios';

import SubmitBtn from '../btn/SubmitBtn';
import { Textarea } from '../shadcn/ui/textarea';
import { useToast } from '../shadcn/ui/use-toast';

export default function ChatBox() {
  const router = useRouter();
  const [ prompt, setPrompt ] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const email = useRecoilValue(emailState);
  const model = useRecoilValue(modelState);
  const modelDN = useRecoilValue(modelDisplayName);
  const setLastPrompt = useSetRecoilState(lastPromptState);
  const { toast } = useToast();

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }

  const submitOnEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && prompt !== '') {
      e.preventDefault();
      handleSumit();
    }
  }

  const handleSumit = async () => {
    const path = window.location.pathname;
    if (path.endsWith('chat')) {
      const _id = (await startChat(email, model)).toLowerCase();
      if (_id.includes('throttled')) {
        toast({
          title: 'User Throttled',
          description: 'You have already used up the allowed tokens for today. Please try again tomorrow.',
          variant: 'destructive'
        });
      } else if (_id.includes('invalid')) {
        toast({
          title: 'Invalid Token',
          description: 'Please login again to continue.',
          variant: 'destructive'
        });
        router.push('/login');
      } else if (_id.includes('server error')) {
        toast({
          title: 'Internal Server Error',
          description: 'Please try again later.',
          variant: 'destructive'
        });
        router.refresh();
      } else if (_id.includes('not found')) {
        toast({
          title: 'User not found',
          description: 'Please login again to continue.',
          variant: 'destructive'
        });
        router.push('/login');
      } else {
        router.push(`/chat/${_id}`);
      }
    }
    setLastPrompt(prompt);
    setPrompt('');
  }

  /// @dev auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const ht = textareaRef.current.scrollHeight;
      if (ht >= 96) {
        textareaRef.current.style.height = '96px';
      } else {
        textareaRef.current.style.height = `${ht}px`;
      }
    }
  }, [prompt]);

  useEffect(() => {
    if (!window.location.pathname.endsWith('chat') && textareaRef && textareaRef.current)
      textareaRef.current.focus();
  }, []);

  return (
    <div className="fixed bottom-4 flex flex-row gap-2 w-3/5 bg-gray-800 rounded-2xl p-2 items-end">
      <Textarea
        rows={1}
        value={prompt}
        ref={textareaRef}
        onChange={handleInput}
        onKeyDown={submitOnEnter}
        placeholder={`Message ${modelDN}`}
        className="resize-none min-h-5 max-h-24 p-2 px-4 border-none rounded-md overflow-hidden w-full focus:ring-0 focus-visible:ring-0"
      />
      <SubmitBtn 
        variant="chatbox"
        disabled={prompt === ''}
        submitAction={handleSumit}
      />
    </div>
  );
}
