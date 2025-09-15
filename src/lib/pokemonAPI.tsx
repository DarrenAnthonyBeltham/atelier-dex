import axios from "axios";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export const getPokemon = async (identifier: string | number) => {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${identifier}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    throw error;
  }
};

export const getPokemonList = async (limit: number = 20, offset: number = 0) => {
    try {
        const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Pokémon list:", error);
        throw error;
    }
}