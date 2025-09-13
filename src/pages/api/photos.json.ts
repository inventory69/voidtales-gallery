import { getCollection } from 'astro:content';

export async function GET() {
  const photos = await getCollection('photos');
  return new Response(JSON.stringify(photos), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}