import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ImagePreview } from './components/ImagePreview';
import { ConversionResult } from './components/ConversionResult';
import { StatusIndicator } from './components/StatusIndicator';
import { useImageConverter } from './hooks/useImageConverter';
import { ConversionStatus } from './types';

function App() {
  const {
    status,
    progress,
    error,
    imageFile,
    conversionResult,
    handleFileUpload,
    convertToSticker,
    copyToClipboard,
    downloadSticker,
    resetState
  } = useImageConverter();

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyToClipboard = async () => {
    await copyToClipboard();
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const canConvert = imageFile && status !== ConversionStatus.PROCESSING;
  const hasResult = conversionResult && status === ConversionStatus.COMPLETED;

  useEffect(() => {
    // Clean up object URLs when component unmounts
    return () => {
      if (imageFile?.preview) {
        URL.revokeObjectURL(imageFile.preview);
      }
      if (conversionResult?.webpUrl) {
        URL.revokeObjectURL(conversionResult.webpUrl);
      }
    };
  }, [imageFile, conversionResult]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        
        <div className="space-y-6">
          {/* Status Indicator */}
          <StatusIndicator 
            status={status} 
            progress={progress} 
            error={error} 
          />

          {/* Upload Zone */}
          <UploadZone
            onFileUpload={handleFileUpload}
            status={status}
            hasImage={!!imageFile}
          />

          {/* Main Content */}
          {imageFile && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Original Image Preview */}
              <ImagePreview
                imageFile={imageFile}
                onRemove={resetState}
              />

              {/* Conversion Result */}
              {hasResult && (
                <ConversionResult
                  result={conversionResult}
                  onCopyToClipboard={handleCopyToClipboard}
                  onDownload={downloadSticker}
                  copySuccess={copySuccess}
                />
              )}

              {/* Convert Button */}
              {!hasResult && (
                <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center">
                  <button
                    onClick={convertToSticker}
                    disabled={!canConvert}
                    className={`
                      px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200
                      ${canConvert
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {status === ConversionStatus.PROCESSING
                      ? 'Converting...'
                      : 'Convert to Sticker'
                    }
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {!imageFile && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">How it works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    1
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Upload Image</h3>
                  <p className="text-sm text-gray-600">
                    Drag & drop or click to select your PNG or JPG image
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    2
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Convert</h3>
                  <p className="text-sm text-gray-600">
                    We'll resize to 512×512px and convert to WebP format
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    3
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Copy & Share</h3>
                  <p className="text-sm text-gray-600">
                    Copy to clipboard and paste directly in WhatsApp
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;