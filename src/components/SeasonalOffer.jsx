import Link from 'next/link';
import { Tag } from 'lucide-react';

export default function SeasonalOffer() {
  return (
    <div 
      className="relative py-24 sm:py-32 rounded-2xl overflow-hidden bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-sky-900/60"></div>

      <div className="relative container mx-auto px-4 text-center text-white">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          <span className="block">End of Season Sale</span>
          <span className="block text-sky-300">Up to 50% Off!</span>
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-sky-100">
          Don't miss out on our biggest sale of the year. Grab your favorites before they're gone!
        </p>
        <div className="mt-10">
          <Link href="/products?sale=true" className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-gray-900 px-8 py-4 text-lg font-bold shadow-lg transition-transform hover:scale-105">
            <Tag />
            Claim Your Discount
          </Link>
        </div>
      </div>
    </div>
  );
}