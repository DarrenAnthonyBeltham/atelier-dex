import { Card } from "@/types/game";
import { Pokemon } from "@/types/pokemon";
import Image from "next/image";

interface GameCardProps {
  card: Card;
  pokemon: Pokemon;
  isFaceDown?: boolean;
  onClick?: () => void;
}

export const GameCard = ({ card, pokemon, isFaceDown = false, onClick }: GameCardProps) => {
  const borderStyle = onClick ? 'cursor-pointer hover:border-yellow-400' : '';

  if (isFaceDown) {
    return <div className="w-24 h-32 rounded-lg bg-blue-500 border-2 border-blue-300"></div>;
  }

  return (
    <div onClick={onClick} className={`w-24 h-32 rounded-lg border-2 border-blue-300 shadow-lg ${borderStyle}`}>
      <Image
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        width={96}
        height={96}
        className="w-full h-full object-contain bg-gray-100 rounded-md"
      />
    </div>
  );
};