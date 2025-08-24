import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Loader, Download, Heart, Share2, Info, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
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
  const [showInfo, setShowInfo] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [uiVisible, setUiVisible] = useState(true);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const hideUITimeout = useRef<NodeJS.Timeout | null>(null);

  // Mouse movement handler for UI visibility
  const handleMouseMove = () => {
    setUiVisible(true);
    if (hideUITimeout.current) clearTimeout(hideUITimeout.current);
    hideUITimeout.current = setTimeout(() => setUiVisible(false), 3000);
  };

  // Reset states when photo changes
  useEffect(() => {
    setImageLoaded(false);
    setZoom(1);
    setRotation(0);
  }, [photo.full]);

  // Check if image is already cached
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
    }
  }, [photo.full]);

  // Auto-hide UI
  useEffect(() => {
    const timer = setTimeout(() => setUiVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (onPrev && canPrev) onPrev();
          break;
        case 'ArrowRight':
          if (onNext && canNext) onNext();
          break;
        case 'i':
        case 'I':
          setShowInfo(!showInfo);
          break;
        case '+':
        case '=':
          setZoom(prev => Math.min(prev * 1.2, 5));
          break;
        case '-':
          setZoom(prev => Math.max(prev / 1.2, 0.1));
          break;
        case 'r':
        case 'R':
          setRotation(prev => prev + 90);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, canPrev, canNext, showInfo]);

  return (
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 select-none animate-fade-in"
      onMouseMove={handleMouseMove}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.12) 0%, transparent 40%),
            radial-gradient(circle at 60% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 35%),
            radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 45%)
          `,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}></div>
      </div>

      {/* Main UI Controls */}
      <div className={`transition-all duration-500 ${showUI && uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 glass rounded-2xl p-3 hover:bg-red-500/20 hover:scale-110 transition-all duration-300 group"
        >
          <X className="w-6 h-6 text-white group-hover:text-red-400" />
        </button>

        {/* Navigation Buttons */}
        {onPrev && (
          <button
            onClick={onPrev}
            disabled={!canPrev}
            className={`absolute left-6 top-1/2 -translate-y-1/2 z-20 glass rounded-2xl p-4 transition-all duration-300 group ${
              !canPrev ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-500/20 hover:scale-110'
            }`}
          >
            <ChevronLeft className="w-8 h-8 text-white group-hover:text-blue-400" />
          </button>
        )}

        {onNext && (
          <button
            onClick={onNext}
            disabled={!canNext}
            className={`absolute right-6 top-1/2 -translate-y-1/2 z-20 glass rounded-2xl p-4 transition-all duration-300 group ${
              !canNext ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-500/20 hover:scale-110'
            }`}
          >
            <ChevronRight className="w-8 h-8 text-white group-hover:text-blue-400" />
          </button>
        )}

        {/* Top Action Bar */}
        <div className="absolute top-6 left-6 flex items-center space-x-3 z-20">
          <div className="glass rounded-2xl px-4 py-2 flex items-center space-x-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isLiked ? 'text-red-400 bg-red-400/20' : 'text-white/60 hover:text-red-400 hover:bg-red-400/10'
              }`}
            >
              <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 rounded-xl text-white/60 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-300">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl text-white/60 hover:text-green-400 hover:bg-green-400/10 transition-all duration-300">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                showInfo ? 'text-blue-400 bg-blue-400/20' : 'text-white/60 hover:text-blue-400 hover:bg-blue-400/10'
              }`}
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="glass rounded-2xl p-2 flex items-center space-x-1">
            <button
              onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.1))}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-white/60 text-sm font-mono w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(prev * 1.2, 5))}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-white/20 mx-1"></div>
            <button
              onClick={() => setRotation(prev => prev + 90)}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex justify-center items-center w-full h-full relative overflow-hidden">
        {(!imageLoaded || loading) && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="glass rounded-3xl p-8 animate-pulse">
              <Loader className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          </div>
        )}
        
        <img
          ref={imgRef}
          src={photo.full}
          alt={photo.title}
          loading='lazy'
          className={`max-w-full max-h-full object-contain transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            filter: 'drop-shadow(0 0 40px rgba(59, 130, 246, 0.2))'
          }}
          draggable={false}
          onLoad={() => {
            setImageLoaded(true);
            if (onImgLoad) onImgLoad();
          }}
        />
      </div>

      {/* Bottom Info Panel */}
      <div className={`absolute bottom-6 left-6 right-6 z-20 transition-all duration-500 ${
        showUI && uiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="glass rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">{photo.title}</h2>
              <p className="text-white/70">{photo.description}</p>
              {typeof currentIndex === 'number' && typeof total === 'number' && (
                <div className="flex items-center space-x-4 text-sm text-white/50">
                  <span>{currentIndex + 1} / {total}</span>
                  <div className="w-1 h-1 rounded-full bg-white/30"></div>
                  <span>HDR Quality</span>
                  <div className="w-1 h-1 rounded-full bg-white/30"></div>
                  <span>{photo.size ? (photo.size / 1024 / 1024).toFixed(2) : "--"} МБ</span>
                </div>
              )}
            </div>
            
            {/* Progress Indicator */}
            {typeof currentIndex === 'number' && typeof total === 'number' && total > 1 && (
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white/60 text-sm font-mono">
                  {currentIndex + 1}/{total}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Extended Info Panel */}
      {showInfo && (
        <div className={`absolute top-20 right-6 w-80 z-20 animate-slide-in transition-all duration-300 ${
          showUI && uiVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="glass rounded-3xl p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Информация о файле</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Название:</span>
                <span className="text-white font-medium">{photo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Размер:</span>
                <span className="text-white">{photo.size ? (photo.size / 1024 / 1024).toFixed(2) : "--"} МБ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Формат:</span>
                <span className="text-white">HDR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Качество:</span>
                <span className="text-green-400 font-medium">Высокое</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="absolute bottom-6 right-6 glass rounded-2xl p-3 text-xs text-white/40 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        ESC: закрыть • ←→: навигация • I: инфо • +/-: зум • R: поворот
      </div>
    </div>
  );
};

export default ImageModal;