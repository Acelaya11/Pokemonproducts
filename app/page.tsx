import Image from 'next/image';
import gengarwallpaper from '../public/gengarwallpaper.png';

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={gengarwallpaper}
          alt="Gengar Wallpaper"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Main Content */}
        <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Welcome to Ponchos Pokemon
            </h1>
            <p className="text-xl text-gray-200 mb-6">
              Your premier destination for high-quality Pokemon collectibles
            </p>
            <p className="text-lg text-gray-600 mb-8">Welcome to our Pokemon card shop! Browse our collection of rare and unique cards.</p>
            <p className="text-lg text-gray-600 mb-8">Find your favorite Pokemon and add them to your collection today!</p>
            <div className="flex justify-center gap-4">
              <a 
                href="/Ponchos" 
                className="w-40 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
              >
                View Collection
              </a>
              <a 
                href="/about" 
                className="w-40 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                About
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
