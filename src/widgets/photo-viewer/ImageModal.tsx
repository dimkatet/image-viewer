import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Loader } from 'lucide-react';

import type { Photo } from '@/utils/storage';

interface ImageModalProps {
  photo: Photo;
  onClose: () => void;
  loading?: boolean;
  showUI?: boolean;
  onImgLoad?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  currentIndex?: number;
  total?: number;
}

const ImageModal: React.FC<ImageModalProps> = ({
  photo,
  onClose,
  loading = false,
  showUI = true,
  onImgLoad,
  onPrev,
  onNext,
  canPrev,
  canNext,
  currentIndex,
  total,
}) => {

  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Сбросить imageLoaded при смене photo
  useEffect(() => {
    setImageLoaded(false);
  }, [photo.full]);

  // Если <img> уже загружено (кеш), выставить imageLoaded=true
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
    }
  }, [photo.full]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 select-none">
      {/* UI Controls */}
      <div className={`transition-opacity duration-300 ${showUI ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white z-10 rounded-full p-2 bg-black/40 hover:bg-red-600 hover:scale-110 transition-all shadow-lg"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
        >
          <X className="w-8 h-8" />
        </button>
        {onPrev && (
          <button
            onClick={onPrev}
            disabled={!canPrev}
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-white z-10 rounded-full p-2 bg-black/40 hover:bg-blue-600 hover:scale-110 transition-all shadow-lg ${
              !canPrev ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
          >
            <ChevronLeft className="w-12 h-12" />
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            disabled={!canNext}
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-white z-10 rounded-full p-2 bg-black/40 hover:bg-blue-600 hover:scale-110 transition-all shadow-lg ${
              !canNext ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
          >
            <ChevronRight className="w-12 h-12" />
          </button>
        )}
      </div>
      {/* Image */}
      <div className="flex justify-center items-center w-full h-full grow-1 relative">
        {(!imageLoaded || loading) && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <Loader className="w-8 h-8 animate-spin text-white" />
          </div>
        )}
        <img
          ref={imgRef}
          src={photo.full}
          alt={photo.title}
          loading='lazy'
          className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ zIndex: 1 }}
          draggable={false}
          onLoad={() => {
            setImageLoaded(true);
            if (onImgLoad) onImgLoad();
          }}
        />
      </div>
      {/* Info */}
      <div className={`absolute bottom-4 left-4 right-4 text-white text-center transition-opacity duration-300 ${showUI ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <h2 className="text-xl font-semibold mb-2">{photo.title}</h2>
        <p className="text-gray-300">{photo.description}</p>
        {/* Текущий/всего */}
        {typeof currentIndex === 'number' && typeof total === 'number' && (
          <div className="mt-2 text-sm text-gray-300">
            {currentIndex + 1} / {total}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
