'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCardData } from '@/lib/tcgData';
import { overpoweredPokemon } from '@/lib/metaData';
import { TcgCard } from '@/types/tcg';
import { TcgCardDetailModal } from '@/components/TcgCardDetailModal';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image';

type CardDataCache = {
  [key: string]: TcgCard;
};

export default function HomePage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [cardData, setCardData] = useState<CardDataCache>({});
  const [selectedCard, setSelectedCard] = useState<TcgCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCards = async () => {
      const cardPromises = overpoweredPokemon.map(name => getCardData(name.split('-')[0]));
      
      try {
        const results = await Promise.all(cardPromises);
        const dataCache: CardDataCache = {};
        results.forEach(card => {
          if (card) {
            dataCache[card.name.toLowerCase()] = card;
          }
        });
        setCardData(dataCache);
      } catch (error) {
        console.error("Failed to fetch card data for homepage", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCards();
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };
  
  const featuredCards = overpoweredPokemon.map(name => cardData[name.split('-')[0]]).filter(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading the Pokédex...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <TcgCardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />

      <header className="text-center my-8">
        <h1 className="text-4xl md:text-5xl font-pixel text-blue-600">Atelier Dex</h1>
        <p className="text-lg text-gray-500 mt-2">Your Ultimate Pokémon Team Builder</p>
      </header>

      <section className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Battle a Friend</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button onClick={createAndJoinRoom} className="w-full md:w-auto bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 transition-colors shadow-sm text-lg">
            Create a New Room
          </button>
          <span className="font-bold text-gray-400">OR</span>
          <div className="flex w-full md:w-auto gap-2">
            <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Enter Room ID..." className="px-4 py-3 border rounded-full w-full text-black bg-gray-100 focus:ring-blue-500 focus:border-blue-500"/>
            <button onClick={joinRoom} className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors shadow-sm">Join</button>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Featured Pokémon</h2>
        <div className="py-4">
          <Slider {...sliderSettings}>
            {featuredCards.map(card => (
              <div key={card.id} className="px-2" onClick={() => setSelectedCard(card)}>
                <div className="bg-gray-200 p-4 rounded-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <Image src={card.images.small} alt={card.name} width={245} height={342} className="mx-auto"/>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </main>
  );
}