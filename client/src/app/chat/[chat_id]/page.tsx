'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Socket } from 'socket.io-client';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { lastPromptState, tokenUsageState } from '@/lib/recoil';
import { startSocket, stopSocket } from '@/lib/socket';

import ChatBox from '@/component/chat/ChatBox';
import ModelSelect from '@/component/chat/ModelSelect';
import ChatMessage from '@/component/chat/ChatMessage';
import { Separator } from '@/component/shadcn/ui/separator';

export default function ChatPage() {
  const path = usePathname();
  const [ chatId, setChatId ] = useState<string | null>(null);
  const [ socket, setSocket ] = useState<Socket | null>(null);
  const [ history, setHistory ] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const lastPrompt = useRecoilValue(lastPromptState);
  const setTokenUsage = useSetRecoilState(tokenUsageState);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleReply = useCallback(({ reply, usage }: any) => {
    setTokenUsage(usage);
    console.log(reply);
    setHistory(h => [...h, { role: 'assistant', content: reply }]);
  }, [setTokenUsage, setHistory]);

  useEffect(() => {
    const _id = path.split('/').pop() as string;
    setChatId(_id);

    const s: Socket = startSocket(_id);    
    s.on('connect', () => {
      setSocket(s as Socket);
    });
    
    return () => stopSocket(s as Socket, _id);
  
  }, [path]);

  useEffect(() => {
    if (socket) {
      setHistory(h => [...h, { role: 'user', content: lastPrompt }]);
      socket.emit('prompt', { _id: chatId, prompt: lastPrompt });
      socket.on('reply', handleReply);
      return () => socket.off('reply', handleReply);
    }
    return () => {};
  }, [socket, lastPrompt, chatId, handleReply]);

  useEffect(() => {
    if (bottomRef && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  return (
    <div className="flex flex-col items-center text-xl h-screen p-6">

      <ModelSelect disabled={true} />

      <div className="flex flex-col gap-6 w-2/3 flex-grow overflow-y-auto pt-6 pb-20 no-scrollbar">
        {history.map((msg, i) => {
          if (i < history.length - 1) {
            return (
              <>
                <ChatMessage key={i} role={msg.role} content={msg.content} />
                <Separator />
              </>
            );
          }
          return <>
            <ChatMessage key={i} role={msg.role} content={msg.content} />
            <div ref={bottomRef} />
          </>;
        })}
      </div>

      <ChatBox />

    </div>
  );
}