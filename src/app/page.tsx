'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPokemon } from '@/lib/pokemonAPI';
import { overpoweredPokemon, topDecks } from '@/lib/metaData';
import { Pokemon } from '@/types/pokemon';
import { PokemonIcon } from '@/components/PokemonIcon';

type PokemonDataCache = {
  [key: string]: Pokemon;
};

export default function HomePage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [pokemonData, setPokemonData] = useState<PokemonDataCache>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPokemon = async () => {
      const allPokemonNames = new Set([
        ...overpoweredPokemon,
        ...topDecks.flatMap(deck => deck.pokemon)
      ]);

      const promises = Array.from(allPokemonNames).map(name => getPokemon(name));
      
      try {
        const results = await Promise.all(promises);
        const dataCache: PokemonDataCache = {};
        results.forEach(p => {
          dataCache[p.name] = p;
        });
        setPokemonData(dataCache);
      } catch (error) {
        console.error("Failed to fetch Pokémon data for homepage", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPokemon();
  }, []);

  const createAndJoinRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    router.push(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      router.push(`/room/${roomId.trim()}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading the Pokédex...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center my-8">
        <h1 className="text-4xl md:text-5xl font-pixel text-blue-600">Atelier Dex</h1>
        <p className="text-lg text-gray-500 mt-2">Your Ultimate Pokémon Team Builder</p>
      </header>

      <section className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Battle a Friend</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button
            onClick={createAndJoinRoom}
            className="w-full md:w-auto bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 transition-colors shadow-sm text-lg"
          >
            Create a New Room
          </button>
          <span className="font-bold text-gray-400">OR</span>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID..."
              className="px-4 py-3 border rounded-full w-full text-black bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={joinRoom}
              className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors shadow-sm"
            >
              Join
            </button>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Most Overpowered Pokémon</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 bg-white p-4 rounded-xl shadow-md">
          {overpoweredPokemon.map(name =>
            pokemonData[name] ? <PokemonIcon key={name} pokemon={pokemonData[name]} /> : null
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Top Team Compositions</h2>
        <div className="space-y-4">
          {topDecks.map(deck => (
            <div key={deck.name} className="bg-white p-4 rounded-xl shadow-md">
              <h3 className="font-bold text-lg mb-2">{deck.name}</h3>
              <div className="flex flex-wrap gap-2">
                {deck.pokemon.map(name =>
                  pokemonData[name] ? <PokemonIcon key={name} pokemon={pokemonData[name]} /> : null
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}