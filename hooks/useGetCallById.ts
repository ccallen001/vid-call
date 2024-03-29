import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

function useGetCallById(id: string | string[]) {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();

  useEffect(() => {
    async function loadCall() {
      if (!client) return;

      const { calls } = await client.queryCalls({
        filter_conditions: { id: id },
      });

      if (calls.length > 0) {
        setCall(calls[0]);
      }

      setIsCallLoading(false);
    }

    loadCall();
  }, [client, id]);

  return { call, isCallLoading };
}

export default useGetCallById;
