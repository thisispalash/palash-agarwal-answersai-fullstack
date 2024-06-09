'use client';

import ChatBox from '@/component/chat/ChatBox';
import ModelSelect from '@/component/chat/ModelSelect';

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center text-xl min-h-screen p-6">

      <ModelSelect disabled={false} />

      <div className="flex flex-col gap-4 w-5/6 h-4/5">
        
      </div>

      <ChatBox />

    </div>
  );
}