'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

import HomeCard from '@/components/HomeCard';
import CallModal from '@/components/CallModal';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

import ReactDatePicker from 'react-datepicker';

function CallTypeList() {
  const router = useRouter();

  const client = useStreamVideoClient();

  const { user } = useUser();

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  });

  const [callDetails, setCallDetails] = useState<Call>();

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

  const callLink = `${process.env.NEXT_PUBLIC_BASE_URL}/call/${callDetails?.id}`;

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

      {!callDetails ? (
        <CallModal
          isOpen={callState === 'isScheduleCall'}
          onClose={() => setCallState(undefined)}
          title="Create Call"
          handleClick={createCall}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
              selected={values.dateTime}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="🕒"
              dateFormat="MMMM d, yyyy h:mm aa"
              onChange={(date) => setValues({ ...values, dateTime: date! })}
            />
          </div>
        </CallModal>
      ) : (
        <CallModal
          isOpen={callState === 'isScheduleCall'}
          onClose={() => setCallState(undefined)}
          title="Call Created"
          handleClick={() => {
            navigator.clipboard.writeText(callLink);
            toast({ title: 'Link Copied!' });
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Call Link"
        />
      )}

      <CallModal
        isOpen={callState === 'isJoinCall'}
        onClose={() => setCallState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Call"
        handleClick={() => router.push(values.link)}
      >
        <Input
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Call link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </CallModal>

      <CallModal
        isOpen={callState === 'isInstantCall'}
        onClose={() => setCallState(undefined)}
        title="Start an Instant Call"
        className="text-center"
        buttonText="Start Call"
        handleClick={createCall}
      />
    </section>
  );
}

export default CallTypeList;
