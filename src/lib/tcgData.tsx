import axios from 'axios';

const TCG_API_BASE_URL = 'https://api.pokemontcg.io/v2';
const API_KEY = process.env.POKEMONTCG_API_KEY;

export const getCardData = async (pokemonName: string) => {
  try {
    const response = await axios.get(`${TCG_API_BASE_URL}/cards`, {
      params: {
        q: `name:${pokemonName}`,
      },
      headers: {
        'X-Api-Key': API_KEY,
      },
    });
    return response.data.data[0];
  } catch (error) {
    console.error('Error fetching TCG card data:', error);
    throw error;
  }
};