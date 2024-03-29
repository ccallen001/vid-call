'use server';

import { currentUser } from '@clerk/nextjs/server';
import { StreamClient } from '@stream-io/node-sdk';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const API_SECRET = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error('User not found');
  if (!API_KEY) throw new Error('Stream API key is missing');
  if (!API_SECRET) throw new Error('Stream secret key is missing');

  const client = new StreamClient(API_KEY, API_SECRET);

  const exp = Math.round(new Date().getTime() / 1000) + 3600;

  const issued = Math.floor(Date.now() / 1000) - 60;

  const token = client.createToken(user.id, exp, issued);

  return token;
};
