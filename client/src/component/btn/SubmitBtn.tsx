'use client';

import { Button } from '../shadcn/ui/button';

export default function SubmitBtn({ submitAction, disabled }: SubmitBtnProps) {
  return (
    <Button 
      type='submit'
      variant='secondary'
      disabled={disabled}
      onClick={submitAction}
    >
      Submit
    </Button>
  );
}

type SubmitBtnProps = {
  disabled: boolean;
  submitAction?: () => void;
};