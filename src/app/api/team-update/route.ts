import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: NextRequest) {
  try {
    const { roomId, team } = await req.json();

    if (!roomId || !team) {
      return NextResponse.json({ message: 'Missing roomId or team data' }, { status: 400 });
    }

    const channelName = `room-${roomId}`;
    const eventName = 'team-updated';

    await pusher.trigger(channelName, eventName, { team });

    return NextResponse.json({ message: 'Team update sent successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}