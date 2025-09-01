import React, { useState } from 'react';
import { CardItem, SealedProduct } from './items-data';
import { Button } from "../../../../components/ui/button";
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ContactFormProps {
  item: CardItem | SealedProduct;
  onSubmit: (message: string, email: string, id: number) => void;
}

export function ContactForm({ item, onSubmit }: ContactFormProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  
  const defaultMessage = "Hi, I'm interested in this item. Is it still available?";

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (isSent) return;
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const messageToSend = message.trim() || defaultMessage;
    setIsSent(true);
    onSubmit(messageToSend, email.toLowerCase(), item.id);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          {item.imageUrl ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
              )}
              <Image
                width={64}
                height={64}
                src={item.imageUrl} 
                alt={item.type === 'card' ? (item as CardItem).card : (item as SealedProduct).product_name} 
                className={`h-20 border-2 border-black rounded object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
                loading='lazy'
              />
              {/* Placeholder for failed images */}
              <div 
                className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-medium hidden"
              >
                No Image
              </div>
            </>
          ) : (
            /* Placeholder for missing images */
            <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-medium">
              No Image
            </div>
          )}
        </div>
        <div>
          <h4 className="font-medium text-white">{item.type === 'card' ? (item as CardItem).card : (item as SealedProduct).product_name}</h4>
          <p className="text-sm text-white">${item.price.toFixed(2)}</p>
          <p className="text-xs text-white">
            {item.type === 'card' ? `Set: ${(item as CardItem).set}` : `Series: ${(item as SealedProduct).sealed_series}`}
          </p>
          {item.type === 'card' && (
            <p className="text-xs text-white">PSA Grade: {(item as CardItem).psa_grade}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-white" htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-200 bg-white rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white">Your message</h4>
        <textarea 
          className="w-full p-2 border border-gray-200 bg-white rounded-md h-24 resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          placeholder={defaultMessage}
          value={message}
          onChange={handleMessageChange}
          disabled={isSent}
        />
      </div>
      
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          className={`bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white transition-colors duration-200 ${
            isSent ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleSubmit}
          disabled={isSent}
        >
          {isSent ? 'Message Sent' : 'Send Message'}
        </Button>
      </div>
    </div>
  );
} 