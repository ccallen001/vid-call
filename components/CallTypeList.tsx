'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

import HomeCard from '@/components/HomeCard';
import CallModal from '@/components/CallModal';
import { toast } from '@/components/ui/use-toast';

function CallTypeList() {
  const router = useRouter();

  const client = useStreamVideoClient();

  const { user } = useUser();

  // eslint-disable-next-line
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
  });
  // eslint-disable-next-line
  const [callDetails, setCallDetails] = useState({});

  const [callState, setCallState] = useState<
    'isInstantCall' | 'isScheduleCall' | 'isJoinCall'
  >();

  async function createCall() {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }

      const id = crypto.randomUUID();

      const call = client.call('default', id);

      if (!call) throw new Error('Failed to create call');

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Call';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) {
        router.push(`/call/${call.id}`);
      }

      toast({
        title: 'Call created!',
      });
    } catch (error) {
      console.error(error);

      toast({ title: 'Failed to create call' });
    }
  }

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Call"
        description="Start an instant call"
        handleClick={() => setCallState('isInstantCall')}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Call"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setCallState('isJoinCall')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Call"
        description="Plan your meeting"
        className="bg-purple-1"
        handleClick={() => setCallState('isScheduleCall')}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Call Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push('/recordings')}
      />

      <CallModal
        className="text-center"
        isOpen={callState === 'isInstantCall'}
        title="Start an Instant Call"
        buttonText="Start Call"
        handleClick={createCall}
        onClose={() => setCallState(undefined)}
      />
    </section>
  );
}

export default CallTypeList;
