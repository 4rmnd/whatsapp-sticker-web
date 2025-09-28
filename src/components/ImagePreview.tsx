import React from 'react';
import { X } from 'lucide-react';
import { ImageFile } from '../types';

interface ImagePreviewProps {
  imageFile: ImageFile;
  onRemove: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageFile,
  onRemove
}) => {
  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={onRemove}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Original Image</h3>
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={imageFile.preview}
            alt="Original"
            className="w-full h-64 object-contain"
          />
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <p>Size: {(imageFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
          <p>Type: {imageFile.file.type}</p>
        </div>
      </div>
    </div>
  );
};