'use client';

import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { tokenUsageState } from '@/lib/recoil';

import { Label } from '../shadcn/ui/label';
import { Progress } from '../shadcn/ui/progress';
import { useToast } from '../shadcn/ui/use-toast';

export default function TokenUsage() {
  const tokenUsage = useRecoilValue(tokenUsageState);
  const { toast } = useToast();

  useEffect(() => {
    if (tokenUsage.pct >= 90) {
      toast({
        title: 'Token Usage Warning',
        description: 'You are running out of tokens. Please use them wisely.',
      });
    }
  }, [tokenUsage, toast]);

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