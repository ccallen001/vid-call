import Image from 'next/image';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

interface CallModalProps {
  className?: string;
  isOpen: boolean;
  title: string;
  buttonText?: string;
  buttonIcon?: string;
  image?: string;
  handleClick?: () => void;
  onClose: () => void;
  children?: React.ReactNode;
}

function CallModal({
  className,
  isOpen,
  title,
  buttonText,
  buttonIcon,
  image,
  handleClick,
  onClose,
  children,
}: CallModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="checked" width={72} height={72} />
            </div>
          )}
          <h1 className={cn('text-3xl font-bold leading-[42px]', className)}>
            {title}
          </h1>

          {children}

          <Button
            className={
              'bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0'
            }
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt="button icon"
                width={13}
                height={13}
              />
            )}
            &nbsp;
            {buttonText || 'Schedule Call'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CallModal;
