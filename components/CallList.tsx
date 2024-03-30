'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useGetCalls from '@/hooks/useGetCalls';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useToast } from '@/components/ui/use-toast';
import CallCard from '@/components/CallCard';
import Loader from '@/components/Loader';

export type CallType = 'upcoming' | 'ended' | 'recording';

interface CallListProps {
  type: CallType;
}

function CallList({ type }: CallListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { upcomingCalls, endedCalls, recordedCalls, isCallsLoading } =
    useGetCalls();

  const [isLoading, setIsLoading] = useState(true);

  const [recordings, setRecordings] = useState<CallRecording[]>();

  useEffect(() => {
    async function fetchRecording() {
      setIsLoading(true);

      try {
        if (!recordedCalls?.length) return;

        const callData = await Promise.all(
          recordedCalls?.map((call) => call.queryRecordings())
        );

        const recordings = callData
          .filter((call) => call.recordings?.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        toast({ title: 'Try again later...' });
      } finally {
        setIsLoading(false);
      }
    }

    if (type === 'recording') fetchRecording();
  }, [type, recordedCalls, toast]);

  useEffect(() => {
    if (!isCallsLoading) {
      setIsLoading(false);
    }
  }, [isCallsLoading]);

  function getCalls() {
    switch (type) {
      case 'upcoming':
        return upcomingCalls;
      case 'ended':
        return endedCalls;
      case 'recording':
        return recordings;
      default:
        return [];
    }
  }

  function getNoCallsMessage() {
    switch (type) {
      case 'upcoming':
        return 'No upcoming calls';
      case 'ended':
        return 'No previous calls';
      case 'recording':
        return 'No recorded calls available';
      default:
        return [];
    }
  }

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((call: Call | CallRecording, i) => {
          return (
            <CallCard
              key={(call as Call).id || i}
              icon={
                type === 'ended'
                  ? '/icons/previous.svg'
                  : type === 'upcoming'
                  ? '/icons/upcoming.svg'
                  : '/icons/recordings.svg'
              }
              title={
                (call as Call).state?.custom?.description ||
                (call as CallRecording).filename?.substring(0, 20) ||
                'No Description'
              }
              date={
                (call as Call).state?.startsAt?.toLocaleString() ||
                (call as CallRecording).start_time?.toLocaleString()
              }
              isPreviousCall={type === 'ended'}
              link={
                type === 'recording'
                  ? (call as CallRecording).url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/call/${
                      (call as Call).id
                    }`
              }
              buttonIcon1={type === 'recording' ? '/icons/play.svg' : undefined}
              buttonText={type === 'recording' ? 'Play' : 'Start'}
              handleClick={
                type === 'recording'
                  ? () => router.push(`${(call as CallRecording).url}`)
                  : () => router.push(`/call/${(call as Call).id}`)
              }
            />
          );
        })
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
}

export default CallList;
