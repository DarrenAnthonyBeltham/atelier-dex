import { GameState, PlayerState } from "@/types/game";
import { Pokemon } from "@/types/pokemon";
import { GameCard } from "./GameCard";

const EmptySlot = () => <div className="w-24 h-32 rounded-lg border-2 border-dashed border-gray-400 bg-black/20"></div>;

const PlayerArea = ({ player, pokemonDataMap, isOpponent }: { player: PlayerState, pokemonDataMap: { [id: number]: Pokemon }, isOpponent: boolean }) => {
  const areaClasses = isOpponent ? "flex-col-reverse" : "flex-col";
  
  return (
    <div className={`flex ${areaClasses} gap-4`}>
      <div className="flex justify-center items-center gap-2">
        {player.bench.map((card, index) => (
          card ? <GameCard key={card.instanceId} pokemon={pokemonDataMap[card.pokemonId]} /> : <EmptySlot key={index} />
        ))}
      </div>
      <div className="flex justify-center">
        {player.activePokemon ? <GameCard pokemon={pokemonDataMap[player.activePokemon.pokemonId]} /> : <EmptySlot />}
      </div>
    </div>
  );
};

interface GameBoardProps {
  gameState: GameState;
  myPlayerId: string;
}

export const GameBoard = ({ gameState, myPlayerId }: GameBoardProps) => {
  const me = gameState.players.find(p => p.id === myPlayerId);
  const opponent = gameState.players.find(p => p.id !== myPlayerId);

  if (!me || !opponent) {
    return <div>Waiting for players...</div>;
  }

  return (
    <div className="w-full bg-green-700 p-4 rounded-lg shadow-xl border-4 border-yellow-300 flex flex-col justify-between h-[80vh]">
      <PlayerArea player={opponent} pokemonDataMap={gameState.pokemonDataMap} isOpponent={true} />
      <div className="border-t-2 border-yellow-300 my-4"></div>
      <PlayerArea player={me} pokemonDataMap={gameState.pokemonDataMap} isOpponent={false} />
    </div>
  );
};