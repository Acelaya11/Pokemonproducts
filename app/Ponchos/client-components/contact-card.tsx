import { items } from './ssr/items-data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { ContactForm } from './ssr/contact-card-ss';
import { toast } from "sonner";
import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ContactDialogProps {
  item: items;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDialog({ item, open, onOpenChange }: ContactDialogProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (message: string, email: string, id: number) => {
    try {
      const response = await fetch('/api/contact-ponchos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          email,
          id: id,
          id_name: item.id_name,
          price: item.price
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
      
      // Close the dialog after a short delay
      setTimeout(() => {
        onOpenChange(false);
        setStatus('idle'); // Reset status when dialog closes
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

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        setStatus('idle'); // Reset status when dialog closes
        setErrorMessage(''); // Clear error message
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-500 shadow-lg rounded-lg border border-gray-300 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader>
          <DialogTitle className="text-white">Contact Seller</DialogTitle>
          <DialogDescription className="text-md text-white">
            Interested in this {item.item_name}? Send a message to the seller.
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
            <button
              onClick={() => {
                setStatus('idle');
                setErrorMessage('');
              }}
              className="mt-4 px-4 py-2 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <ContactForm item={item} onSubmit={handleSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
} 