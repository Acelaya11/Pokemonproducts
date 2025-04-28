'use client';

import { CartProvider } from './client-components/CartContext';

export default function PonchosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
} 