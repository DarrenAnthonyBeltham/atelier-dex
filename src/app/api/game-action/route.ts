import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import Pusher from 'pusher';
import { GameState, PlayerState, Card } from '@/types/game';
import { Pokemon, PokemonType } from '@/types/pokemon';
import { getPokemon as fetchFullPokemon } from '@/lib/pokemonAPI';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

interface FullPokemonFromAPI {
    id: number;
    name: string;
    sprites: {
        front_default: string;
        other: { 'official-artwork': { front_default: string } };
    };
    types: PokemonType[];
}

const trimPokemonData = (fullPokemon: FullPokemonFromAPI): Pokemon => {
  return {
    id: fullPokemon.id,
    name: fullPokemon.name,
    sprites: {
      front_default: fullPokemon.sprites.front_default,
      other: {
        'official-artwork': {
          front_default: fullPokemon.sprites.other['official-artwork'].front_default,
        },
      },
    },
    types: fullPokemon.types,
  };
};

async function createNewGame(roomId: string): Promise<GameState> {
  const decklist = ['bulbasaur', 'charmander', 'squirtle', 'pidgey', 'rattata', 'pikachu'];
  const deckPromises = decklist.map(name => fetchFullPokemon(name));
  const fullPokemonData = await Promise.all(deckPromises);
  const uniquePokemon = fullPokemonData.map(trimPokemonData);

  const pokemonDataMap: { [id: number]: Pokemon } = {};
  uniquePokemon.forEach(p => {
    pokemonDataMap[p.id] = p;
  });

  const createDeck = (): Card[] => {
    return Array(60).fill(null).map((_, i) => {
      const pokemon = uniquePokemon[i % uniquePokemon.length];
      return { instanceId: `${pokemon.name}-${i}`, pokemonId: pokemon.id };
    });
  };

  const shuffle = (deck: Card[]) => deck.sort(() => Math.random() - 0.5);
  const deck1 = shuffle(createDeck());
  const deck2 = shuffle(createDeck());

  const player1: PlayerState = {
    id: 'player1', name: 'Player 1',
    hand: deck1.splice(0, 7),
    prizeCards: deck1.splice(0, 6),
    deck: deck1,
    activePokemon: null,
    bench: Array(5).fill(null),
    discardPile: [],
  };

  const player2: PlayerState = {
    id: 'player2', name: 'Player 2',
    hand: deck2.splice(0, 7),
    prizeCards: deck2.splice(0, 6),
    deck: deck2,
    activePokemon: null,
    bench: Array(5).fill(null),
    discardPile: [],
  };

  return {
    gameId: roomId,
    status: 'PLAYING',
    pokemonDataMap,
    players: [player1, player2],
    activePlayerId: 'player1',
    turn: 1,
    log: ['Game setup complete. Player 1 starts.'],
  };
}

export async function POST(req: NextRequest) {
  try {
    const { roomId, action, payload, playerId } = await req.json();
    let gameState: GameState | null = await kv.get(roomId);

    if (action === 'SETUP_GAME' && !gameState) {
      gameState = await createNewGame(roomId);
    }

    if (!gameState) {
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    const activePlayer = gameState.players.find(p => p.id === gameState.activePlayerId);
    if (activePlayer && activePlayer.id === playerId) {
      switch (action) {
        case 'PLAY_TO_BENCH':
          const cardToPlay = activePlayer.hand.find(c => c.instanceId === payload.cardId);
          const emptyBenchSlot = activePlayer.bench.findIndex(s => s === null);
          if (cardToPlay && emptyBenchSlot !== -1) {
            activePlayer.bench[emptyBenchSlot] = cardToPlay;
            activePlayer.hand = activePlayer.hand.filter(c => c.instanceId !== payload.cardId);
            if (!activePlayer.activePokemon) {
               activePlayer.activePokemon = activePlayer.bench[emptyBenchSlot];
               activePlayer.bench[emptyBenchSlot] = null;
            }
          }
          break;

        case 'END_TURN':
          const nextPlayer = gameState.players.find(p => p.id !== gameState.activePlayerId);
          if (nextPlayer) {
            gameState.activePlayerId = nextPlayer.id;
            gameState.turn += 1;
            gameState.log.push(`It is now ${nextPlayer.name}'s turn.`);
          }
          break;
      }
    }

    await kv.set(roomId, gameState);
    await pusher.trigger(`room-${roomId}`, 'game-update', gameState);
    return NextResponse.json({ message: 'Action processed' });

  } catch (error) {
    console.error("Error in game-action API:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}