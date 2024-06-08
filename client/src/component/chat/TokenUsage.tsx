'use client';

import { useRecoilValue } from 'recoil';
import { tokenUsageState } from '@/lib/recoil';

import { Label } from '../shadcn/ui/label';
import { Progress } from '../shadcn/ui/progress';

export default function TokenUsage() {
  const tokenUsage = useRecoilValue(tokenUsageState);

  return (
    <div className="flex flex-col gap-4 w-4/5">
      <Label>Token Usage</Label>
      <Progress value={tokenUsage.pct} />
      
      <div className="flex flex-row justify-between">
        <Label>Daily Limit</Label>
        <Label>{tokenUsage.limit}</Label>
      </div>

      <div className="flex flex-row justify-between">
        <Label>Tokens Used</Label>
        <Label>{tokenUsage.actual}</Label>
      </div>

    </div>
  );
}