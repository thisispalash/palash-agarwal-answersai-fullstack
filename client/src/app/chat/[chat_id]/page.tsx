'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Socket } from 'socket.io-client';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { lastPromptState, tokenUsageState } from '@/lib/recoil';
import { startSocket, stopSocket } from '@/lib/socket';

import ChatBox from '@/component/chat/ChatBox';
import ModelSelect from '@/component/chat/ModelSelect';
import ChatMessage from '@/component/chat/ChatMessage';
import Spinner from '@/component/Spinner';
import { Separator } from '@/component/shadcn/ui/separator';
import { useToast } from '@/component/shadcn/ui/use-toast';

export default function ChatPage() {
  const path = usePathname();
  const [ chatId, setChatId ] = useState<string | null>(null);
  const [ socket, setSocket ] = useState<Socket | null>(null);
  const [ history, setHistory ] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [ isResponding, setIsResponding ] = useState(false);
  const lastPrompt = useRecoilValue(lastPromptState);
  const setTokenUsage = useSetRecoilState(tokenUsageState);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleReply = useCallback(({ reply, usage }: any) => {
    setIsResponding(false);
    setTokenUsage(usage);
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
      setIsResponding(true);
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

  socket?.on('error', (msg: string) => {
    msg = msg.toLowerCase();
    if (msg.includes('throttled')) {
      toast({
        title: 'User Throttled',
        description: 'You have already used up the allowed tokens for today. Please try again tomorrow.',
        variant: 'destructive'
      });
    } else if (msg.includes('openai')) {
      toast({
        title: 'OpenAI error',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } else if (msg.includes('not found')) {
      /// @dev this case should not happen since we manage chatId in the URL
      toast({
        title: 'Chat not found',
        description: 'Did you mess with the url? Please start a new chat.',
        variant: 'destructive',
      });
      router.push('/chat');
    } 
  })

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
        {isResponding && <Spinner />}
      </div>

      <ChatBox />

    </div>
  );
}