import React from 'react';
import { MessageCircle } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-green-100 rounded-full">
          <MessageCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          WhatsApp Sticker Converter
        </h1>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Transform any image into a WhatsApp sticker instantly. Upload your image, 
        convert it to the perfect format, and copy directly to WhatsApp.
      </p>
    </header>
  );
};