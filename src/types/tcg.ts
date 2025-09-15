export interface TcgAttack {
  name: string;
  cost: string[];
  convertedEnergyCost: number;
  damage: string;
  text: string;
}

export interface TcgWeakness {
  type: string;
  value: string;
}

export interface TcgCard {
  id: string;
  name: string;
  hp: string;
  types: string[];
  attacks: TcgAttack[];
  weaknesses: TcgWeakness[];
  images: {
    small: string;
    large: string;
  };
}

export interface PlayerState {
  id: string;
  name: string;
  deck: TcgCard[];
  hand: TcgCard[];
  activePokemon: TcgCard | null;
  bench: (TcgCard | null)[];
  prizeCards: TcgCard[];
  discardPile: TcgCard[];
}

export interface GameState {
  gameId: string;
  status: 'SETUP' | 'PLAYING' | 'FINISHED';
  players: [PlayerState, PlayerState];
  activePlayerId: string;
  turn: number;
  log: string[];
}