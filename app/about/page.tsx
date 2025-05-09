import Image from 'next/image';
import gengarwallpper from '../../public/gengarwallpaper.png';

export default function About() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={gengarwallpper}
          alt="Gengar Background"
          fill
          className="object-cover opacity-60"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider">
          About Page
        </h1>
        <p className="text-xl md:text-2xl text-white/90">
          Coming Soon...
        </p>
      </div>
    </main>
  );
} 