'use client';

import { useRecoilState } from 'recoil';
import { modelState } from '@/lib/recoil';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../shadcn/ui/select';
import { Label } from '../shadcn/ui/label';

export default function ModelSelect() {
  const [model, setModel] = useRecoilState(modelState);

  return (
    <div className="flex flex-col gap-4 w-4/5">
      <Label>Select Model</Label>
      <Select onValueChange={(v) => setModel(v)} defaultValue="gpt-3.5-turbo">
        <SelectTrigger>
          <SelectValue placeholder="Change Model">{model}</SelectValue>
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