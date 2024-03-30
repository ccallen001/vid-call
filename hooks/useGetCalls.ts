import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

function useGetCalls() {
  const { user } = useUser();
  const client = useStreamVideoClient();

  const [calls, setCalls] = useState<Call[]>();
  const [isCallsLoading, setIsCallsLoading] = useState(true);

  useEffect(() => {
    async function loadCalls() {
      if (!user || !client) return;

      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        });

        setCalls(calls);
      } catch (error) {
        console.error(error);
      } finally {
        setIsCallsLoading(false);
      }
    }

    loadCalls();
  }, [user, client]);

  const now = new Date();

  const upcomingCalls = calls?.filter(
    ({ state: { startsAt } }: Call) => startsAt && new Date(startsAt) > now
  );
  const endedCalls = calls?.filter(
    ({ state: { startsAt /* , endedAt */ } }: Call) =>
      startsAt && new Date(startsAt) < now /* || !!endedAt */
  );
  const recordedCalls = calls;

  return { upcomingCalls, endedCalls, recordedCalls, isCallsLoading };
}

export default useGetCalls;
