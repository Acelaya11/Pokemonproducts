'use client';

import { useState } from 'react';
import Image from 'next/image';
import charmander from '../../../public/charmanderstarter.png';
import bulbasaur from '../../../public/bulbasaurstarter.png';
import squirtle from '../../../public/squirtlestarter.png';
import { Button } from '@/components/ui/button';

const STARTER_POKEMON = [
  { name: 'Charmander', image: charmander },
  { name: 'Bulbasaur', image: bulbasaur },
  { name: 'Squirtle', image: squirtle }
];

export function PokemonGenerator() {
  const [selectedPokemon, setSelectedPokemon] = useState<{ name: string; image: typeof charmander } | null>(null);
  const [animationState, setAnimationState] = useState<'idle' | 'shaking' | 'opening' | 'reveal'>('idle');
  const [headingText, setHeadingText] = useState('Choose Your Shopping Buddy');

  const chooseStarter = () => {
    setHeadingText('Your Shopping Buddy is...');
    setAnimationState('shaking');
    setSelectedPokemon(null);
    
    const randomIndex = Math.floor(Math.random() * STARTER_POKEMON.length);
    
    // Sequence of animations
    setTimeout(() => {
      setAnimationState('opening');
      setTimeout(() => {
        setAnimationState('reveal');
        setSelectedPokemon(STARTER_POKEMON[randomIndex]);
      }, 1000);
    }, 3000);
  };

  return (
    <>
      {/* Full page flash overlay */}
      {animationState === 'opening' && (
        <div className="fixed inset-0 bg-stone-200 animate-flash z-50"></div>
      )}

      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-white mb-8">{headingText}</h2>
        
        <div className="relative w-32 h-32 my-2">
          {/* Pokeball */}
          <div className={`pokeball ${animationState} w-full h-full relative transition-opacity duration-500 ${
            animationState === 'opening' || animationState === 'reveal' ? 'opacity-0' : 'opacity-100'
          }`}>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-red-600 rounded-t-full"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white rounded-b-full"></div>
              <div className="absolute top-1/2 left-0 w-full h-4 bg-black -translate-y-2"></div>
              <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full -translate-x-4 -translate-y-4 border-4 border-black"></div>
            </div>
          </div>

          {/* Pokemon Image */}
          {selectedPokemon && animationState === 'reveal' && (
            <div className="absolute inset-0 animate-fade-in">
              <Image
                src={selectedPokemon.image}
                alt={selectedPokemon.name}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>

        {selectedPokemon && animationState === 'reveal' && (
          <h3 className="text-xl font-semibold text-white mb-8 animate-fade-in">
            {selectedPokemon.name} !
          </h3>
        )}

        <Button
          onClick={chooseStarter}
          disabled={animationState !== 'idle'}
          className={`px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-500 mt-8 ${
            animationState === 'opening' || animationState === 'reveal' 
              ? 'opacity-0 scale-0' 
              : animationState !== 'idle' 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
          }`}
        >
          Generate
        </Button>

        <style jsx global>{`
          @keyframes shake {
            0% { transform: translateX(0) rotate(0deg); }
            15% { transform: translateX(-15px) rotate(-2deg); }
            30% { transform: translateX(15px) rotate(2deg); }
            45% { transform: translateX(-12px) rotate(-1deg); }
            60% { transform: translateX(12px) rotate(1deg); }
            75% { transform: translateX(-8px) rotate(-0.5deg); }
            90% { transform: translateX(8px) rotate(0.5deg); }
            100% { transform: translateX(0) rotate(0deg); }
          }

          @keyframes flash {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }

          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .pokeball {
            transition: transform 0.3s ease;
          }

          .pokeball.shaking {
            animation: shake 1.5s ease-in-out infinite;
          }

          .pokeball.opening {
            transform: scale(1.2) rotate(180deg);
          }

          .animate-flash {
            animation: flash 0.5s ease-in-out;
          }

          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
        `}</style>
      </div>
    </>
  );
} 