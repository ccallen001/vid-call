'use client';

import { useStreamVideoClient } from '@stream-io/video-react-sdk';

import { useUser } from '@clerk/nextjs';
import useGetCallById from '@/hooks/useGetCallById';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface TableProps {
  title: string;
  description: string;
}

function Table({ title, description }: TableProps) {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}:
      </h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
}

function PersonalRoomRoute() {
  const router = useRouter();

  const { user } = useUser();
  const callId = user?.id || '';

  const client = useStreamVideoClient();

  const callLink = `${process.env.NEXT_PUBLIC_BASE_URL}/call/${callId}?personal=true`;

  const { call } = useGetCallById(callId);

  async function startRoom() {
    if (!user || !client) return;

    if (!call) {
      const newCall = client.call('default', callId);

      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/call/${callId}?personal=true`);
  }

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Personal Room</h1>

      <div className="flex flex-col gap-8 w-full xl:max-w-[900px]">
        <Table
          title="Topic"
          description={`${user?.username}'s Personal Room`}
        />

        <Table title="Call Id" description={callId} />

        <Table title="Invite Link" description={callLink} />
      </div>

      <div className="flex gap-5">
        <Button className="bg-blue-1" onClick={startRoom}>
          Start Call
        </Button>
        <Button
          className="bg-dark-3"
          onClick={() => {
            navigator.clipboard.writeText(callLink);
            toast({ title: 'Link Copied!' });
          }}
        >
          Copy Invite Link
        </Button>
      </div>
    </section>
  );
}

export default PersonalRoomRoute;
