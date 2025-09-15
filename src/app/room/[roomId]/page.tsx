import RoomClient from './RoomClient';

export default function RoomPage({ params }: { params: any }) {
  const roomId = params.roomId as string;
  return <RoomClient roomId={roomId} />;
}