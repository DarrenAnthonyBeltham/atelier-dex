import { Pokemon, PokemonType } from "@/types/pokemon";
import Image from "next/image";

interface PokemonCardProps {
  pokemon: Pokemon;
}

const typeColors: { [key: string]: string } = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-700",
  ghost: "bg-indigo-700",
  dragon: "bg-indigo-800",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg max-w-xs mx-auto bg-gray-50">
      <Image
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={pokemon.name}
        width={200}
        height={200}
        className="mx-auto"
      />
      <h2 className="text-2xl font-bold capitalize text-center mt-2 text-black">
        {pokemon.name}
      </h2>
      <div className="text-center text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</div>
      <div className="flex justify-center gap-2 mt-2">
        {pokemon.types.map((typeInfo: PokemonType) => (
          <span
            key={typeInfo.type.name}
            className={`px-3 py-1 text-sm text-white rounded-full ${typeColors[typeInfo.type.name] || 'bg-gray-400'}`}
          >
            {typeInfo.type.name}
          </span>
        ))}
      </div>
    </div>
  );
};