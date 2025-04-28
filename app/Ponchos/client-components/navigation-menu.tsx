'use client';

import Link from 'next/link';
import Image from 'next/image';
import Yarn from '../../../public/pokeball.png';
import Gengar from '../../../public/gengarlogo.jpg';
import { Sell } from './sell';
import { QADialog } from './qa-dialog';

export function NavigationMenu() {
  const scrollToGrid = () => {
    const gridElement = document.getElementById('item-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 mb-20 shadow-md shadow-black items-center flex h-16 md:h-20 lg:h-24 relative">
      <div className="flex flex-wrap pl-4 md:pl-10 pr-4 md:pr-20 py-2 w-full items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-8">
          <Image 
            src={Gengar} 
            alt="Gengar" 
            className="logo w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 shadow-lg shadow-black rounded-lg" 
          />
          {/* Navigation Links */}
          <div className="flex flex-wrap gap-1 md:gap-2 lg:gap-4">
            <div 
              onClick={scrollToGrid} 
              className="text-white hover:text-gray-900 px-1 md:px-2 lg:px-3 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium cursor-pointer nav-link whitespace-nowrap"
            >
              Shop
            </div>
            <Sell />
            <QADialog />
            <Link 
              href="/about" 
              className="text-white hover:text-gray-900 px-1 md:px-2 lg:px-3 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium nav-link whitespace-nowrap"
            >
              About
            </Link>
          </div>
        </div>
        <Image 
          src={Yarn} 
          alt="Yarn" 
          className="absolute shadow-lg shadow-black rounded-full h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 animate-drop-bounce-roll" 
        />
      </div>
    </div>
  );
}