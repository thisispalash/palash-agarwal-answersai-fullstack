'use client';

import { Badge } from "../shadcn/ui/badge";

export default function ChatMessage({ role, content }: ChatMessageProps) {

  return (
    <div className="flex flex-col gap-4 items-start w-full">
      <Badge variant="outline">{role}</Badge>
      <pre className="text-sm px-4 w-full whitespace-pre-wrap">
        {content}
      </pre>
    </div>
  );
}

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}