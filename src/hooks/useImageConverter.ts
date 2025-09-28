import { useState, useCallback } from 'react';
import { ImageFile, ConversionResult, ConversionStatus } from '../types';
import { processImageFile, copyToClipboard, copyToClipboardAlternative, downloadBlob } from '../utils/imageProcessor';

export const useImageConverter = () => {
  const [status, setStatus] = useState<ConversionStatus>(ConversionStatus.IDLE);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);

  const resetState = useCallback(() => {
    setStatus(ConversionStatus.IDLE);
    setProgress(0);
    setError(null);
    setImageFile(null);
    setConversionResult(null);
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    setError(null);
    setStatus(ConversionStatus.UPLOADING);
    
    const preview = URL.createObjectURL(file);
    setImageFile({ file, preview });
    setStatus(ConversionStatus.IDLE);
  }, []);

  const convertToSticker = useCallback(async () => {
    if (!imageFile) {
      setError('No image selected');
      return;
    }

    try {
      setStatus(ConversionStatus.PROCESSING);
      setProgress(25);
      setError(null);

      // Process the image
      setProgress(75);
      const result = await processImageFile(imageFile.file);
      
      setProgress(100);
      setConversionResult(result);
      setStatus(ConversionStatus.COMPLETED);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setStatus(ConversionStatus.ERROR);
    }
  }, [imageFile]);

  const copyToClipboardHandler = useCallback(async () => {
    if (!conversionResult) {
      setError('No conversion result available');
      return;
    }

    try {
      setError(null);
      // Add a small delay to ensure the UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try the alternative method first for better WhatsApp compatibility
      const blobToUse = conversionResult.webpBlob;
      try {
        await copyToClipboardAlternative(blobToUse);
      } catch (altError) {
        // Fallback to original method
        const pngBlob = conversionResult.pngBlob || conversionResult.webpBlob;
        await copyToClipboard(pngBlob);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to copy to clipboard');
    }
  }, [conversionResult]);

  const downloadSticker = useCallback(() => {
    if (!conversionResult) {
      setError('No conversion result available');
      return;
    }

    downloadBlob(conversionResult.webpBlob, 'whatsapp-sticker.webp');
  }, [conversionResult]);

  return {
    status,
    progress,
    error,
    imageFile,
    conversionResult,
    handleFileUpload,
    convertToSticker,
    copyToClipboard: copyToClipboardHandler,
    downloadSticker,
    resetState
  };
};