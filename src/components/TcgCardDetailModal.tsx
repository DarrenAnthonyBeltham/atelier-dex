import { TcgCard } from '@/types/tcg';
import Image from 'next/image';

interface TcgCardDetailModalProps {
  card: TcgCard | null;
  onClose: () => void;
}

export const TcgCardDetailModal = ({ card, onClose }: TcgCardDetailModalProps) => {
  if (!card) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-100 rounded-2xl w-full max-w-lg flex flex-col md:flex-row gap-6 p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-4 text-3xl font-bold text-gray-400 hover:text-gray-800">&times;</button>
        
        <div className="flex-shrink-0 w-full md:w-1/2">
          <Image src={card.images.large} alt={card.name} width={488} height={680} className="rounded-lg shadow-xl" />
        </div>

        <div className="text-black w-full md:w-1/2">
          <h2 className="text-3xl font-bold">{card.name}</h2>
          <p className="font-semibold text-lg text-gray-600">HP {card.hp} - {card.types?.join(', ')}</p>

          <div className="my-4 h-48 overflow-y-auto pr-2">
            {card.attacks?.map(attack => (
              <div key={attack.name} className="mt-2">
                <div className="flex justify-between items-center">
                  <strong className="text-lg">{attack.name}</strong>
                  <span className="font-bold text-xl">{attack.damage}</span>
                </div>
                <p className="text-sm text-gray-600">{attack.text}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-2 text-sm text-gray-700">
            {card.weaknesses?.map(w => (
              <p key={w.type}><strong className="w-24 inline-block">Weakness:</strong> {w.type} ({w.value})</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};