export interface ImageFile {
  file: File;
  preview: string;
}

export interface ConversionResult {
  webpBlob: Blob;
  pngBlob?: Blob; // Add optional PNG blob for clipboard compatibility
  webpUrl: string;
  originalSize: number;
  compressedSize: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface ConversionOptions {
  quality: number;
  maxSize: number; // in bytes
}

export enum ConversionStatus {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error'
}