import { items } from './ssr/items-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { ItemDescriptionContent } from './ssr/item-description-ss';
import { ContactDialog } from './contact-card';
import { useState, useEffect } from 'react';

interface ItemDescriptionProps {
  item: items;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemDescriptionDialog({ item, open, onOpenChange }: ItemDescriptionProps) {
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const handleOpenContact = () => {
      setContactOpen(true);
    };

    window.addEventListener('openContactDialog', handleOpenContact);
    return () => {
      window.removeEventListener('openContactDialog', handleOpenContact);
    };
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-500 shadow-lg rounded-lg border border-gray-300 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-2 md:px-4">
          <DialogHeader>
            <DialogTitle className="text-white">Item Details</DialogTitle>
          </DialogHeader>
          <ItemDescriptionContent item={item} />
        </DialogContent>
      </Dialog>

      <ContactDialog 
        item={item}
        open={contactOpen}
        onOpenChange={setContactOpen}
      />
    </>
  );
}