'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Socket } from 'socket.io-client';
import { useRecoilValue } from 'recoil';

import { initialPromptState } from '@/lib/recoil';
import { startSocket, stopSocket } from '@/lib/socket';

import ChatBox from '@/component/chat/ChatBox';
import ModelSelect from '@/component/chat/ModelSelect';

export default function ChatPage() {
  const path = usePathname();
  const [ chatId, setChatId ] = useState<string | null>(null);
  const [ socket, setSocket ] = useState<Socket | null>(null);
  const [ prompt, setPrompt ] = useState('');
  const initialPrompt = useRecoilValue(initialPromptState);

  const handleReply = (reply: string) => {

  }

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
    if (socket) 
      socket.emit('prompt', { _id: chatId, prompt: initialPrompt });
  }, [socket, initialPrompt, chatId]);

  useEffect(() => {
    if (socket) {
      socket.emit('prompt', { _id: chatId, prompt });
      socket.on('reply', handleReply);
    }
  }, [socket, prompt, chatId]);


  return (
    <div className="flex flex-col items-center text-xl min-h-screen p-6">

      <ModelSelect disabled={true} />

      <div className="flex flex-col gap-4 w-5/6 h-4/5">
        
      </div>

      <ChatBox socket={socket} setLastPrompt={setPrompt} setSocket={setSocket} />

    </div>
  );
}