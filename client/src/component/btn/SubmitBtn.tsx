'use client';

import { Button } from '../shadcn/ui/button';

export default function SubmitBtn({ submitAction, disabled, variant }: SubmitBtnProps) {

  if (variant === 'chatbox') {
    return (
      <Button 
        type="submit"
        variant="default"
        disabled={disabled}
        onClick={submitAction}
        className="rounded-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" className="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
        </svg>
      </Button>
    );
  }


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
  variant?: 'default' | 'chatbox';
  submitAction?: () => void;
};