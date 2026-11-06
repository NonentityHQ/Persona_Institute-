import 'server-only';
import { defineLive } from 'next-sanity/live';
import { client, apiVersion } from './client';

const live = defineLive({
  client: client.withConfig({ apiVersion }),
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
});

export const { sanityFetch, SanityLive } = live;
