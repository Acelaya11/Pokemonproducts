'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { EmailMatch } from './email-match';
import { Button } from '@/components/ui/button';

export function Sell() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [description, setDescription] = useState('');
  const [validEmail, setValidEmail] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!validEmail) {
      toast.error('Please enter matching email addresses');
      return;
    }

    if (!description.trim()) {
      toast.error('Please describe the items you want to sell');
      return;
    }

    try {
      const response = await fetch('/api/sell-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: validEmail,
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setRequestId(data.requestId);
      setStatus('success');
      toast.success('Message sent successfully!', {
        duration: 3000,
        position: 'top-center',
      });
      
      // Close the dialog after a short delay
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        setValidEmail(null);
        setDescription('');
        setRequestId(null);
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
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="text-white hover:text-gray-900 px-2 py-1 md:px-3 md:py-2 rounded-md text-sm md:text-base font-medium nav-link whitespace-nowrap cursor-pointer"
      >
        Sell
      </Button>
      <Dialog open={isOpen} onOpenChange={(newOpen) => {
        if (!newOpen) {
          setStatus('idle');
          setErrorMessage('');
          setValidEmail(null);
          setDescription('');
          setRequestId(null);
        }
        setIsOpen(newOpen);
      }}>
        <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-500 shadow-lg rounded-lg border border-gray-300">
          <DialogHeader>
            <DialogTitle className="text-white">Sell Your Items</DialogTitle>
            <DialogDescription className="text-md text-white">
              Have Pokemon cards or sealed products you want to sell? Fill out the form below and I&apos;ll get back to you with an offer.
            </DialogDescription>
          </DialogHeader>
          
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Request Submitted Successfully!</h3>
              <p className="text-white text-center">Thank you for your interest. I&apos;ll review your items and get back to you soon.</p>
              {requestId && (
                <p className="text-sm text-gray-300 mt-2">Reference ID: {requestId}</p>
              )}
            </div>
          ) : status === 'error' ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Failed to Submit Request</h3>
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
            <div className="space-y-4">
              <EmailMatch 
                onEmailMatch={setValidEmail} 
                showErrors={true}
                className="space-y-4"
              />
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                  Items Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-white border border-zinc-700 rounded-md placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Please describe the items you want to sell, including card names, conditions, and any other relevant details..."
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full px-4 py-2 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-md transition-colors"
              >
                Submit for Review
              </Button>
            </div>
          )}
          <p className="text-sm text-white">I&apos;ll review your items and get back to you with an offer.</p>
          <p className="text-sm text-white">Please provide accurate descriptions and conditions for the best offer.</p>
        </DialogContent>
      </Dialog>
    </>
  );
} 