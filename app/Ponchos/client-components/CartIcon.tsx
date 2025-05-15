'use client';
import { useCart } from './CartContext';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import Image from 'next/image';
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { EmailMatch } from './email-match';

export function CartIcon() {
  const { items, totalItems, removeItem, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showEmailErrors, setShowEmailErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (totalItems === 0) {
    if (isOpen) setIsOpen(false);
    if (contactOpen) setContactOpen(false);
    return null;
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleClearCart = () => {
    clearCart();
    setIsOpen(false);
  };

  const handleContactSubmit = async () => {
    if (!email) {
      setShowEmailErrors(true);
      return;
    }

    const messageToSend = message.trim() || "Hi, I'm interested in these items. Are they still available?";

    try {
      const response = await fetch('/api/contact-ponchos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          email,
          items: items.map(item => ({
            id: item.id,
            id_name: item.id_name,
            item_name: item.item_name,
            price: item.price,
            set: item.type === 'card' ? item.set : item.series,
            psa_grade: item.type === 'card' ? item.psa_grade : undefined
          })),
          totalAmount: total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      toast.success('Message sent successfully!', {
        duration: 3000,
        position: 'top-center',
      });
      
      setTimeout(() => {
        setContactOpen(false);
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
      toast.error('Failed to send message. Please try again.', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items,
          email: email || undefined
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-8 z-50 p-0 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 bg-transparent hover:bg-transparent pokeball-fade-in"
        variant="ghost"
      >
        <Image
          src="/pokeball.png"
          alt="Cart"
          width={64}
          height={64}
          className="w-16 h-16"
        />
        <span className="absolute -top-5 -right-5 bg-black text-white text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center shadow-md">
          {totalItems}
        </span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-500 shadow-lg rounded-lg border border-gray-300">
          <DialogHeader className="flex-none">
            <DialogTitle className="text-white">Shopping Cart</DialogTitle>
          </DialogHeader>

          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 my-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-zinc-800/50 p-3 rounded-lg">
                  <div className="relative w-16 h-16">
                    <Image
                      width={64}
                      height={64}
                      src={item.imageUrl}
                      alt={item.item_name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{item.item_name}</h4>
                    <p className="text-sm text-white">${item.price.toFixed(2)}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white border-0"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="flex-none border-t border-zinc-600 pt-4 mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-white font-medium">Total:</span>
                    <span className="text-white font-bold">${total.toFixed(2)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCart}
                    className="bg-red-600 hover:bg-red-700 text-white border-0"
                  >
                    Clear Cart
                  </Button>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white"
                    onClick={() => setContactOpen(true)}
                  >
                    Contact Seller
                  </Button>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Checkout'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={contactOpen} onOpenChange={(newOpen) => {
        if (!newOpen) {
          setStatus('idle');
          setErrorMessage('');
          setEmail(null);
          setMessage('');
          setShowEmailErrors(false);
        }
        setContactOpen(newOpen);
      }}>
        <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-500 shadow-lg rounded-lg border border-gray-300 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Contact Seller</DialogTitle>
            <DialogDescription className="text-md text-white">
              Interested in these items? Send a message to the seller.
            </DialogDescription>
          </DialogHeader>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Message Sent Successfully!</h3>
              <p className="text-white text-center">Thank you for your interest. The seller will contact you soon.</p>
            </div>
          ) : status === 'error' ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Failed to Send Message</h3>
              <p className="text-white text-center mb-4">{errorMessage}</p>
              <Button
                onClick={() => {
                  setStatus('idle');
                  setErrorMessage('');
                }}
                className="mt-4 px-4 py-2 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-md transition-colors"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-zinc-800/50 p-3 rounded-lg">
                    <div className="relative w-16 h-16">
                      <Image
                        width={64}
                        height={64}
                        src={item.imageUrl}
                        alt={item.item_name}
                        className="h-16 w-16 object-cover rounded"
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
                ))}
              </div>

              <div className="border-t border-zinc-600 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-medium">Total:</span>
                  <span className="text-white font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <EmailMatch onEmailMatch={setEmail} showErrors={showEmailErrors} />
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Your message</h4>
                <textarea 
                  className="w-full p-2 border border-gray-200 bg-white rounded-md h-24 resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="Hi, I'm interested in these items. Are they still available?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  className="bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white transition-colors duration-200"
                  onClick={handleContactSubmit}
                >
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 