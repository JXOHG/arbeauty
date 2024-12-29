import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import heic2any from 'heic2any';

const LazyImage = ({ src, alt, className, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const imageRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const loadImage = async () => {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        
        // Handle HEIC conversion
        if (blob.type === 'image/heic') {
          const jpegBlob = await heic2any({
            blob,
            toType: 'image/jpeg',
            quality: 0.8
          });
          const objectUrl = URL.createObjectURL(jpegBlob);
          setImageSrc(objectUrl);
          setIsLoading(false);
          return;
        }
        
        // Handle regular images
        const objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading image:', error);
        setImageSrc('/placeholder.svg?height=300&width=300');
        setIsLoading(false);
      }
    };

    loadImage();

    // Cleanup function to revoke object URLs
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [isVisible, src]);

  return (
    <div ref={imageRef} className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}
      {isVisible && (
        <img
          src={imageSrc || '/placeholder.svg?height=300&width=300'}
          alt={alt}
          className={className}
          onClick={onClick}
          onError={(e) => {
            console.error('Image failed to load:', src);
            e.target.src = '/placeholder.svg?height=300&width=300';
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;