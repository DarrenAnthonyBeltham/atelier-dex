import { Pokemon } from './pokemon';

export interface Card {
  instanceId: string;
  pokemonId: number;
}

export interface PlayerState {
  id: string;
  name: string;
  deck: Card[];
  hand: Card[];
  activePokemon: Card | null;
  bench: (Card | null)[];
  prizeCards: Card[];
  discardPile: Card[];
}

export interface GameState {
  gameId: string;
  status: 'SETUP' | 'PLAYING' | 'FINISHED';
  pokemonDataMap: { [id: number]: Pokemon };
  players: [PlayerState, PlayerState];
  activePlayerId: string;
  turn: number;
  log: string[];
}