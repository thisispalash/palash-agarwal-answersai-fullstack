'use client';

import { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import { modelDisplayName } from '@/lib/recoil';

import { Textarea } from '../shadcn/ui/textarea';
import SubmitBtn from '../btn/SubmitBtn';

export default function ChatBox() {
  const [ prompt, setPrompt ] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const model = useRecoilValue(modelDisplayName);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }

  const submitOnEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && prompt !== '') {
      e.preventDefault();
      handleSumit();
    }
  }

  const handleSumit = () => {
    console.log(prompt);
    setPrompt('');
  }

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

  return (
    <div className="fixed bottom-4 flex flex-row gap-2 w-3/5 bg-gray-800 rounded-2xl p-2 items-end">
      <Textarea
        rows={1}
        value={prompt}
        ref={textareaRef}
        onChange={handleInput}
        onKeyDown={submitOnEnter}
        placeholder={`Message ${model}`}
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