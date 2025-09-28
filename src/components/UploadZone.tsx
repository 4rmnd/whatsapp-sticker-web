import React, { useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { ConversionStatus } from '../types';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  status: ConversionStatus;
  hasImage: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileUpload,
  status,
  hasImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  const handleClick = useCallback(() => {
    if (status !== ConversionStatus.UPLOADING && !hasImage) {
      fileInputRef.current?.click();
    }
  }, [status, hasImage]);

  if (hasImage) {
    return null;
  }

  const isUploading = status === ConversionStatus.UPLOADING;

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
        transition-all duration-300 ease-in-out
        ${isDragOver
          ? 'border-green-400 bg-green-50 scale-105'
          : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
        }
        ${isUploading ? 'pointer-events-none opacity-50' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />
      
      <div className="flex flex-col items-center space-y-4">
        <div className={`
          p-4 rounded-full transition-all duration-300
          ${isDragOver ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}
        `}>
          {isUploading ? (
            <div className="animate-spin">
              <Upload className="w-8 h-8" />
            </div>
          ) : (
            <ImageIcon className="w-8 h-8" />
          )}
        </div>
        
        <div className="space-y-2">
          <p className={`text-lg font-medium ${isDragOver ? 'text-green-600' : 'text-gray-700'}`}>
            {isUploading ? 'Uploading...' : 'Drop your image here'}
          </p>
          <p className="text-sm text-gray-500">
            or click to browse files
          </p>
          <p className="text-xs text-gray-400">
            PNG or JPG, max 10MB
          </p>
        </div>
      </div>
    </div>
  );
};