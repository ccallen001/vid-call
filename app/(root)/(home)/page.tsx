'use client';

import { useEffect, useState } from 'react';

import CallTypeList from '@/components/CallTypeList';
import { getRandomGreeting } from '@/lib/utils';

function Home() {
  const [now, setNow] = useState(new Date());

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newNow = new Date();

      if (newNow.getMinutes() !== now.getMinutes()) {
        setNow(newNow);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [now]);

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism rounded py-2 text-center text-base font-normal">
            {getRandomGreeting()}
          </h2>

          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>

            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      <CallTypeList />
    </section>
  );
}

export default Home;
