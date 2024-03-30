import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { LayoutList, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import EndCallButton from '@/components/EndCallButton';
import Loader from '@/components/Loader';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

function CallRoom() {
  const router = useRouter();

  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [isShowingParticipants, setIsShowingParticipants] = useState(false);

  const callingState = useCallStateHooks().useCallCallingState();

  const isPersonalRoom = !!useSearchParams().get('personal');

  if (callingState !== CallingState.JOINED) {
    return <Loader />;
  }

  function CallLayout() {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-left':
        return <SpeakerLayout participantsBarPosition="right" />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative  flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>

        <div
          className={cn('h-[calc(100vh - 86px)] hidden ml-2', {
            'show-block': isShowingParticipants,
          })}
        >
          <CallParticipantsList
            onClose={() => setIsShowingParticipants(false)}
          />
        </div>
      </div>

      <div className="fixed bottom-0 flex flex-wrap w-full items-center justify-center gap-5">
        <CallControls onLeave={() => router.push('/')} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList className="text-white" size={20} />
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((layout, i) => (
              <div key={i}>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    setLayout(layout.toLowerCase() as CallLayoutType)
                  }
                >
                  {layout}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        <Button onClick={() => setIsShowingParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </Button>

        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
}

export default CallRoom;
