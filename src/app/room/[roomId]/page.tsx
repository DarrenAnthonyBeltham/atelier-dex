import RoomClient from "./roomClient";

interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  return <RoomClient roomId={params.roomId} />;
}