import RoomClient from './RoomClient';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RoomPage({ params }: { params: any }) {
  const roomId = params.roomId as string;
  return <RoomClient roomId={roomId} />;
}