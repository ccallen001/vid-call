'use client';

import { useState } from 'react';

import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';

import CallRoom from '@/components/CallRoom';
import CallSetup from '@/components/CallSetup';
import Loader from '@/components/Loader';

import useGetCallById from '@/hooks/useGetCallById';

function Call({ params }: { params: { id: string } }) {
  // eslint-disable-next-line
  const { user, isLoaded } = useUser();

  const [isSetupComplete, setIsSetupComplete] = useState();

  const { call, isCallLoading } = useGetCallById(params.id);

  if (!isLoaded || isCallLoading) return <Loader />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {isSetupComplete ? (
            <CallRoom />
          ) : (
            // @ts-ignore
            <CallSetup {...{ setIsSetupComplete }} />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
}

export default Call;
