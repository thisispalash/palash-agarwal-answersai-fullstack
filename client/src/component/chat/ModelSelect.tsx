'use client';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { modelDisplayName, modelState } from '@/lib/recoil';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../shadcn/ui/select';

export default function ModelSelect({ disabled }: ModelSelectProps) {
  const setModel = useSetRecoilState(modelState);
  const modelName = useRecoilValue(modelDisplayName);

  return (
    <div className="flex flex-col gap-4 bg-gray-800 rounded-2xl w-1/6 right-4 fixed">
      <Select 
        disabled={disabled}
        defaultValue="gpt-3.5-turbo" 
        onValueChange={(v) => setModel(v)} 
      >
        <SelectTrigger className="border-0 focus:ring-0 focus-active:ring-0">
          <SelectValue placeholder="Change Model">{modelName}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>OpenAI</SelectLabel>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

interface ModelSelectProps {
  disabled: boolean;
}