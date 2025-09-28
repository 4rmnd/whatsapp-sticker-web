import Resizer from 'react-image-file-resizer';
import { ConversionResult, ConversionOptions } from '../types';

export const validateImageFile = (file: File): string | null => {
  // Check file type
  if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
    return 'Only PNG and JPG files are supported';
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    return 'File size must be less than 10MB';
  }

  return null;
};

export const validateStickerResult = (result: ConversionResult): boolean => {
  // Validate dimensions (must be exactly 512x512)
  if (result.dimensions.width !== 512 || result.dimensions.height !== 512) {
    return false;
  }

  // Validate file size (should be under 100KB for WhatsApp)
  if (result.compressedSize > 100 * 1024) {
    return false;
  }

  // Validate that we have both WebP and PNG blobs
  if (!result.webpBlob || !result.pngBlob) {
    return false;
  }

  return true;
};

export const resizeImageToCanvas = (file: File): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Set canvas to 512x512 (WhatsApp sticker size)
      canvas.width = 512;
      canvas.height = 512;

      // WhatsApp requires 16px margin, so usable area is 480x480
      const margin = 1;
      const usableSize = 512 - (margin * 2); // 480x480
      
      // Calculate scaling to maintain aspect ratio within usable area
      const scale = Math.min(usableSize / img.width, usableSize / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Center the image within the usable area
      const x = margin + (usableSize - scaledWidth) / 2;
      const y = margin + (usableSize - scaledHeight) / 2;

      // Clear canvas with transparent background
      ctx.clearRect(0, 0, 512, 512);
      
      // Draw the image centered and scaled with margin
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      
      resolve(canvas);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const addWhatsAppOutline = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
  // Simply return the original canvas without adding any outline
  // WhatsApp doesn't actually require the white outline for recognition
  return canvas;
};

export const convertCanvasToWebP = async (
  canvas: HTMLCanvasElement,
  options: ConversionOptions
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Add WhatsApp outline to the canvas
    const outlinedCanvas = addWhatsAppOutline(canvas);
    
    outlinedCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to WebP'));
        }
      },
      'image/webp',
      options.quality / 100
    );
  });
};

export const compressToTargetSize = async (
  canvas: HTMLCanvasElement,
  maxSize: number = 100 * 1024, // 100KB default
  initialQuality: number = 90
): Promise<ConversionResult> => {
  let quality = initialQuality;
  let webpBlob: Blob;

  // Try to compress until we get under the target size
  do {
    webpBlob = await convertCanvasToWebP(canvas, { quality, maxSize });
    
    if (webpBlob.size <= maxSize || quality <= 10) {
      break;
    }
    
    quality -= 10;
  } while (quality > 0);

  // Create a high-quality PNG version for better clipboard compatibility
  const pngBlob = await new Promise<Blob>((resolve, reject) => {
    // Add WhatsApp outline to the canvas for PNG as well
    const outlinedCanvas = addWhatsAppOutline(canvas);
    
    outlinedCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to PNG'));
        }
      },
      'image/png'
    );
  });

  const webpUrl = URL.createObjectURL(webpBlob);

  return {
    webpBlob,
    pngBlob, // Add PNG blob for clipboard compatibility
    webpUrl,
    originalSize: webpBlob.size,
    compressedSize: webpBlob.size,
    dimensions: {
      width: 512,
      height: 512
    }
  };
};

export const processImageFile = async (file: File): Promise<ConversionResult> => {
  // Validate file
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  try {
    // Resize image to canvas
    const canvas = await resizeImageToCanvas(file);
    
    // Convert and compress to WebP
    const result = await compressToTargetSize(canvas);
    
    // Validate the result to ensure it meets WhatsApp sticker requirements
    if (!validateStickerResult(result)) {
      throw new Error('Generated sticker does not meet WhatsApp requirements. Please try with a different image.');
    }
    
    return result;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to process image');
  }
};

export const copyToClipboard = async (blob: Blob): Promise<void> => {
  try {
    // Always use PNG format for clipboard to ensure WhatsApp compatibility
    let clipboardBlob: Blob;
    
    if (blob.type === 'image/png') {
      clipboardBlob = blob;
    } else {
      // Convert WebP to PNG for clipboard
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      clipboardBlob = await new Promise<Blob>((resolve, reject) => {
        img.onload = () => {
          // Ensure exact WhatsApp sticker dimensions
          canvas.width = 512;
          canvas.height = 512;
          
          // Clear with transparent background
          ctx?.clearRect(0, 0, 512, 512);
          
          // WhatsApp requires 16px margin, so usable area is 480x480
          const margin = 16;
          const usableSize = 512 - (margin * 2); // 480x480
          
          // Calculate scaling to maintain aspect ratio within usable area
          const scale = Math.min(usableSize / img.width, usableSize / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          
          // Center the image within the usable area
          const x = margin + (usableSize - scaledWidth) / 2;
          const y = margin + (usableSize - scaledHeight) / 2;
          
          ctx?.drawImage(img, x, y, scaledWidth, scaledHeight);
          
          // Add WhatsApp outline
          const outlinedCanvas = addWhatsAppOutline(canvas);
          
          outlinedCanvas.toBlob((pngBlob) => {
            if (pngBlob) {
              resolve(pngBlob);
            } else {
              reject(new Error('Failed to convert to PNG'));
            }
          }, 'image/png');
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(blob);
      });
    }
    
    // Method 1: Try modern Clipboard API with ClipboardItem
    if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
      const clipboardItem = new ClipboardItem({
        'image/png': clipboardBlob
      });
      
      await navigator.clipboard.write([clipboardItem]);
      return;
    }
    
    // Method 2: Try converting to canvas and use toBlob with clipboard
    if (navigator.clipboard && navigator.clipboard.write) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = async () => {
          canvas.width = 512;
          canvas.height = 512;
          ctx?.clearRect(0, 0, 512, 512);
          
          // WhatsApp requires 16px margin, so usable area is 480x480
          const margin = 16;
          const usableSize = 512 - (margin * 2); // 480x480
          
          // Calculate scaling to maintain aspect ratio within usable area
          const scale = Math.min(usableSize / img.width, usableSize / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          
          // Center the image within the usable area
          const x = margin + (usableSize - scaledWidth) / 2;
          const y = margin + (usableSize - scaledHeight) / 2;
          
          ctx?.drawImage(img, x, y, scaledWidth, scaledHeight);
          
          // Add WhatsApp outline
          const outlinedCanvas = addWhatsAppOutline(canvas);
          
          outlinedCanvas.toBlob(async (canvasBlob) => {
            if (canvasBlob) {
              try {
                const clipboardItem = new ClipboardItem({
                  'image/png': canvasBlob
                });
                await navigator.clipboard.write([clipboardItem]);
                resolve(true);
              } catch (error) {
                reject(error);
              }
            } else {
              reject(new Error('Failed to create canvas blob'));
            }
          }, 'image/png');
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(clipboardBlob);
      });
      
      return;
    }
    
    // Method 3: Fallback - create temporary download link
    throw new Error('Clipboard API not fully supported. Please use the download button instead.');
    
  } catch (error) {
    // Enhanced error handling with specific messages
    if (error instanceof Error) {
      if (error.message.includes('not supported') || error.message.includes('not allowed')) {
        throw new Error('Clipboard access not available. Please use the download button and manually add to WhatsApp.');
      } else if (error.message.includes('denied')) {
        throw new Error('Clipboard permission denied. Please allow clipboard access and try again.');
      } else {
        throw new Error(`Copy failed: ${error.message}. Try using the download button instead.`);
      }
    }
    throw new Error('Failed to copy to clipboard. Please try downloading the sticker instead.');
  }
};


export const copyToClipboardAlternative = async (blob: Blob): Promise<void> => {
  try {
    // Create a temporary canvas with WhatsApp sticker specifications
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = () => {
        // Set exact WhatsApp sticker dimensions
        canvas.width = 512;
        canvas.height = 512;
        
        // Clear with transparent background
        ctx?.clearRect(0, 0, 512, 512);
        
        // WhatsApp requires 16px margin, so usable area is 480x480
        const margin = 16;
        const usableSize = 512 - (margin * 2);
        
        // Calculate scaling to maintain aspect ratio within usable area
        const scale = Math.min(usableSize / img.width, usableSize / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        
        // Center the image within the usable area
        const x = margin + (usableSize - scaledWidth) / 2;
        const y = margin + (usableSize - scaledHeight) / 2;
        
        ctx?.drawImage(img, x, y, scaledWidth, scaledHeight);
        
        // Add WhatsApp outline
        const outlinedCanvas = addWhatsAppOutline(canvas);
        
        // Convert to PNG with specific settings for WhatsApp
        outlinedCanvas.toBlob(async (pngBlob) => {
          if (pngBlob) {
            try {
              // Try multiple clipboard methods
              if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
                const clipboardItem = new ClipboardItem({
                  'image/png': pngBlob
                });
                await navigator.clipboard.write([clipboardItem]);
                resolve(true);
              } else {
                // Fallback: create a temporary download
                const url = URL.createObjectURL(pngBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'whatsapp-sticker.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                resolve(true);
              }
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        }, 'image/png');
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(blob);
    });
  } catch (error) {
    throw new Error(`Alternative copy method failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const downloadBlob = (blob: Blob, filename: string = 'whatsapp-sticker.webp'): void => {
  // Ensure the filename has the correct extension based on blob type
  const correctFilename = blob.type === 'image/png' 
    ? filename.replace(/\.webp$/, '.png')
    : filename;
    
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = correctFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
