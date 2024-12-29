import React, { useState, useEffect } from 'react';
import heic2any from 'heic2any';
import { X, Loader2 } from 'lucide-react';

const FullScreenImage = ({ image, onClose }) => {
  const [imageUrl, setImageUrl] = useState(image.url);
  const [isLoading, setIsLoading] = useState(true);

  const convertHeicToJpeg = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      if (blob.type === 'image/heic') {
        const jpegBlob = await heic2any({
          blob,
          toType: 'image/jpeg',
          quality: 0.8
        });
        return URL.createObjectURL(jpegBlob);
      }
      return url;
    } catch (error) {
      console.error('Error converting HEIC to JPEG:', error);
      return url;
    }
  };

  useEffect(() => {
    const convertImage = async () => {
      setIsLoading(true);
      const convertedUrl = await convertHeicToJpeg(image.url);
      setImageUrl(convertedUrl);
      setIsLoading(false);
    };
    convertImage();

    // Cleanup function to revoke object URL
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [image.url]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fullscreen-image-title"
    >
      <div className="relative max-w-4xl max-h-full w-full p-4">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
          )}
          <img
            src={imageUrl}
            alt={image.alt}
            className={`max-w-full max-h-[calc(100vh-2rem)] object-contain mx-auto transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            id="fullscreen-image-title"
            onLoad={() => setIsLoading(false)}
          />
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white bg-opacity-75 text-black p-2 rounded-full hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          aria-label="Close full screen image"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default FullScreenImage;