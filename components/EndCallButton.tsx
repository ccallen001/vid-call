import { useRouter } from 'next/navigation';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { Button } from '@/components/ui/button';

function EndCallButton() {
  const router = useRouter();

  const call = useCall();

  const localParticipant = useCallStateHooks().useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  return (
    <Button
      className="bg-red-500"
      onClick={async () => {
        await call.endCall();
        router.push('/');
      }}
    >
      End Call for All
    </Button>
  );
}

export default EndCallButton;
