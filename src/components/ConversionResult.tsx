import React from 'react';
import { Copy, Download, Check } from 'lucide-react';
import { ConversionResult as ConversionResultType } from '../types';

interface ConversionResultProps {
  result: ConversionResultType;
  onCopyToClipboard: () => void;
  onDownload: () => void;
  copySuccess?: boolean;
}

export const ConversionResult: React.FC<ConversionResultProps> = ({
  result,
  onCopyToClipboard,
  onDownload,
  copySuccess = false
}) => {
  const formatFileSize = (bytes: number): string => {
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">WhatsApp Sticker</h3>
        
        {/* Preview */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img
            src={result.webpUrl}
            alt="Converted sticker"
            className="w-full h-64 object-contain"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Size</p>
            <p className="text-lg font-bold text-green-600">
              {formatFileSize(result.compressedSize)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Dimensions</p>
            <p className="text-lg font-bold text-gray-700">
              {result.dimensions.width}×{result.dimensions.height}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCopyToClipboard}
            disabled={copySuccess}
            className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium
              transition-all duration-200
              ${copySuccess
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-green-600 hover:bg-green-700 text-white'
              }
              ${copySuccess ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            {copySuccess ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
          
          <button
            onClick={onDownload}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
        
        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Cara menggunakan:</strong> Klik "Copy" lalu buka WhatsApp, buka chat, dan paste (Ctrl+V). 
            Sticker sekarang sudah memenuhi standar WhatsApp dengan margin 16px untuk kompatibilitas maksimal.
          </p>
        </div>
        
        {/* Additional Info */}
        <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-700">
            ✅ Dimensi: 512×512px | ✅ Margin: 16px | ✅ Format: PNG untuk clipboard | ✅ Tanpa border berlebihan
          </p>
        </div>
      </div>
    </div>
  );
};