import { Pokemon } from "@/types/pokemon";
import Image from "next/image";

interface PokemonIconProps {
  pokemon: Pokemon;
}

export const PokemonIcon = ({ pokemon }: PokemonIconProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-2 rounded-lg hover:bg-gray-200 transition-colors">
      <Image
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        width={96}
        height={96}
        className="w-20 h-20"
      />
      <p className="text-xs capitalize font-semibold mt-1">{pokemon.name.replace('-', ' ')}</p>
    </div>
  );
};