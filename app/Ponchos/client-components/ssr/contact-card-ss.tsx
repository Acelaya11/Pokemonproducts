import React, { useState } from 'react';
import { items } from './items-data';
import { Button } from "../../../../components/ui/button";
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ContactFormProps {
  item: items;
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
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            width={64}
            height={64}
            src={item.imageUrl} 
            alt={item.item_name} 
            className={`h-20 border-2 border-black rounded object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
          />
        </div>
        <div>
          <h4 className="font-medium text-white">{item.item_name}</h4>
          <p className="text-sm text-white">${item.price.toFixed(2)}</p>
          <p className="text-xs text-white">
            {item.type === 'card' ? `Set: ${item.set}` : `Series: ${item.series}`}
          </p>
          {item.type === 'card' && (
            <p className="text-xs text-white">PSA Grade: {item.psa_grade}</p>
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