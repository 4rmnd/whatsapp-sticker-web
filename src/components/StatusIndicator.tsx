import React from 'react';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ConversionStatus } from '../types';

interface StatusIndicatorProps {
  status: ConversionStatus;
  progress: number;
  error?: string | null;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  progress,
  error
}) => {
  if (status === ConversionStatus.IDLE) {
    return null;
  }

  const getStatusConfig = () => {
    switch (status) {
      case ConversionStatus.UPLOADING:
        return {
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          message: 'Uploading image...',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200'
        };
      case ConversionStatus.PROCESSING:
        return {
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          message: 'Converting to sticker...',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200'
        };
      case ConversionStatus.COMPLETED:
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          message: 'Sticker ready! Copy to WhatsApp or download.',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200'
        };
      case ConversionStatus.ERROR:
        return {
          icon: <XCircle className="w-5 h-5" />,
          message: error || 'An error occurred',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          message: 'Unknown status',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-center gap-3">
        <div className={config.textColor}>
          {config.icon}
        </div>
        <div className="flex-1">
          <p className={`font-medium ${config.textColor}`}>
            {config.message}
          </p>
          {status === ConversionStatus.PROCESSING && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};