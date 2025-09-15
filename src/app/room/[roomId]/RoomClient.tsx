'use client';

import { useEffect, useState, FC } from 'react';
import { useSearchParams } from 'next/navigation';
import Pusher from 'pusher-js';
import { GameState, PlayerState, Card } from '@/types/game';
import { Pokemon } from '@/types/pokemon';
import Image from 'next/image';

const CardDisplay = ({ pokemon, isFaceDown = false, onClick }: { pokemon?: Pokemon, isFaceDown?: boolean, onClick?: () => void }) => (
  <div onClick={onClick} className={`w-24 h-32 rounded-lg border-2 border-blue-300 shadow-lg ${onClick ? 'cursor-pointer hover:border-yellow-400' : ''}`}>
    {isFaceDown || !pokemon ? (
      <div className="w-full h-full bg-blue-500 rounded-lg"></div>
    ) : (
      <Image src={pokemon.sprites.front_default} alt={pokemon.name} width={96} height={96} className="w-full h-full object-contain bg-gray-100 rounded-md" />
    )}
  </div>
);

const EmptySlot = () => <div className="w-24 h-32 rounded-lg border-2 border-dashed border-gray-400 bg-black/20"></div>;

const PlayerZone = ({ player, pokemonDataMap, isOpponent, onCardClick }: { player: PlayerState, pokemonDataMap: { [id: number]: Pokemon }, isOpponent: boolean, onCardClick: (cardId: string) => void }) => (
  <div className={`flex flex-col gap-4 ${isOpponent ? 'flex-col-reverse' : ''}`}>
    <div className="flex justify-center items-center gap-4 min-h-[8rem]">
      {isOpponent ? (
        player.hand.map((_, i) => <div key={i} className="w-24 h-32 rounded-lg bg-blue-500 border-2 border-blue-300"></div>)
      ) : (
        player.hand.map(card => <CardDisplay key={card.instanceId} pokemon={pokemonDataMap[card.pokemonId]} onClick={() => onCardClick(card.instanceId)} />)
      )}
    </div>
    <div className="flex justify-between items-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-32 rounded-lg bg-blue-800 text-white flex flex-col items-center justify-center font-bold text-lg">{player.deck.length}<span className="text-sm">Deck</span></div>
        <div className="w-24 h-32 rounded-lg bg-gray-600 text-white flex flex-col items-center justify-center font-bold text-lg">{player.discardPile.length}<span className="text-sm">Discard</span></div>
      </div>
      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="flex justify-center gap-2">
          {player.bench.map((card, i) => card ? <CardDisplay key={card.instanceId} pokemon={pokemonDataMap[card.pokemonId]} /> : <EmptySlot key={i} />)}
        </div>
        <div className="flex justify-center">
          {player.activePokemon ? <CardDisplay key={player.activePokemon.instanceId} pokemon={pokemonDataMap[player.activePokemon.pokemonId]} /> : <EmptySlot />}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-32 rounded-lg bg-yellow-500 text-white flex flex-col items-center justify-center font-bold text-xl">{player.prizeCards.length}<span className="text-base">Prizes</span></div>
      </div>
    </div>
  </div>
);

interface RoomClientProps {
  roomId: string;
}

const RoomClient: FC<RoomClientProps> = ({ roomId }) => {
  const searchParams = useSearchParams();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const myPlayerId = searchParams.get('player') === '2' ? 'player2' : 'player1';

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER! });
    const channel = pusher.subscribe(`room-${roomId}`);
    channel.bind('game-update', (data: GameState) => setGameState(data));
    return () => { pusher.unsubscribe(`room-${roomId}`) };
  }, [roomId]);

  const sendAction = (action: string, payload: Record<string, unknown> = {}) => {
    fetch('/api/game-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, action, payload, playerId: myPlayerId }),
    });
  };

  if (!gameState) {
    return (
      <main className="container mx-auto p-4 text-center">
        <h1 className="text-4xl font-pixel text-blue-600">Atelier Dex</h1>
        <button onClick={() => sendAction('SETUP_GAME')} className="mt-8 bg-red-500 text-white px-8 py-4 rounded-full font-bold text-2xl hover:bg-red-600 transition-colors">
          Start Game!
        </button>
      </main>
    );
  }
  
  const me = gameState.players.find(p => p.id === myPlayerId);
  const opponent = gameState.players.find(p => p.id !== myPlayerId);

  if (!me || !opponent) {
    return (
      <main className="container mx-auto p-4 text-center">
        <p>Waiting for players...</p>
      </main>
    );
  }

  const isMyTurn = gameState.activePlayerId === myPlayerId;

  return (
    <main className="container mx-auto p-2 bg-green-800/50 rounded-lg">
      <div className="text-center my-2 text-white">
        <h2 className="font-bold text-2xl">{isMyTurn ? "Your Turn" : "Opponent's Turn"}</h2>
        <p>{gameState.log[gameState.log.length - 1]}</p>
      </div>
      <div className="flex flex-col justify-between gap-4">
        <PlayerZone player={opponent} pokemonDataMap={gameState.pokemonDataMap} isOpponent={true} onCardClick={() => {}} />
        {isMyTurn && (
          <div className="flex justify-center">
            <button onClick={() => sendAction('END_TURN')} className="bg-yellow-500 text-black px-6 py-2 rounded-full font-bold">End Turn</button>
          </div>
        )}
        <PlayerZone player={me} pokemonDataMap={gameState.pokemonDataMap} isOpponent={false} onCardClick={(cardId) => sendAction('PLAY_TO_BENCH', { cardId })} />
      </div>
    </main>
  );
};

export default RoomClient;