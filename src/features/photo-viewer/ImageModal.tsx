import type { Photo } from "@/utils/storage";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Heart,
  Info,
  Loader,
  RotateCw,
  Share2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

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
  const [mobileInfoExpanded, setMobileInfoExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  
  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);
  
  const imgRef = useRef<HTMLImageElement | null>(null);
  const hideUITimeout = useRef<NodeJS.Timeout | null>(null);

  // Более точное определение мобильного устройства и ориентации
  useEffect(() => {
    const checkDevice = () => {
      // Проверяем как размер экрана, так и touch-возможности
      const isMobileDevice = 'ontouchstart' in window || 
                            navigator.maxTouchPoints > 0 ||
                            window.innerWidth <= 768;
      
      const isLandscapeOrientation = window.innerWidth > window.innerHeight;
      
      setIsMobile(isMobileDevice);
      setIsLandscape(isLandscapeOrientation);
      
      // На мобильных устройствах UI скрыт по умолчанию
      if (isMobileDevice) {
        setUiVisible(false);
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    window.addEventListener("orientationchange", () => {
      // Небольшая задержка для корректного получения новых размеров после поворота
      setTimeout(checkDevice, 100);
    });

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, []);

  // Mouse movement handler for UI visibility (только для десктопа)
  const handleMouseMove = () => {
    if (!isMobile) {
      setUiVisible(true);
      if (hideUITimeout.current) clearTimeout(hideUITimeout.current);
      hideUITimeout.current = setTimeout(() => setUiVisible(false), 3000);
    }
  };

  // Swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
    setIsSwiping(false);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.x && !touchStart.y) return;
    
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
    
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    
    // Определяем, что это свайп (горизонтальное движение больше вертикального)
    if (deltaX > deltaY && deltaX > 10) {
      setIsSwiping(true);
      // e.preventDefault(); // Предотвращаем скролл
    }
  }, [touchStart]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart.x || !touchStart.y) return;
    
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // Если это был свайп (горизонтальное движение преобладает)
    if (isSwiping && absDeltaX > absDeltaY && absDeltaX > 50) {
      if (deltaX > 0 && onPrev && canPrev) {
        onPrev(); // Свайп вправо - предыдущее изображение
      } else if (deltaX < 0 && onNext && canNext) {
        onNext(); // Свайп влево - следующее изображение
      }
    } else if (!isSwiping && absDeltaX < 10 && absDeltaY < 10) {
      // Простое нажатие (тап) - показать/скрыть UI
      if (isMobile) {
        setUiVisible(!uiVisible);
        if (!uiVisible) {
          // Автоматически скрыть UI через 4 секунды после показа
          if (hideUITimeout.current) clearTimeout(hideUITimeout.current);
          hideUITimeout.current = setTimeout(() => setUiVisible(false), 4000);
        }
      }
    }
    
    // Сброс состояния
    setTouchStart({ x: 0, y: 0 });
    setTouchEnd({ x: 0, y: 0 });
    setIsSwiping(false);
  }, [touchStart, touchEnd, isSwiping, isMobile, uiVisible, onPrev, onNext, canPrev, canNext]);

  // Reset states when photo changes
  useEffect(() => {
    setImageLoaded(false);
    setZoom(1);
    setRotation(0);
    setMobileInfoExpanded(false);
  }, [photo.full]);

  // Check if image is already cached
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
      onImgLoad?.();
    }
  }, [photo.full]);

  // Auto-hide UI только для десктопа
  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => setUiVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (onPrev && canPrev) onPrev();
          break;
        case "ArrowRight":
          if (onNext && canNext) onNext();
          break;
        case "i":
        case "I":
          setShowInfo(!showInfo);
          break;
        case "+":
        case "=":
          setZoom((prev) => Math.min(prev * 1.2, 5));
          break;
        case "-":
          setZoom((prev) => Math.max(prev / 1.2, 0.1));
          break;
        case "r":
        case "R":
          setRotation((prev) => prev + 90);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext, canPrev, canNext, showInfo]);

  return (
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 select-none animate-fade-in"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            background: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.12) 0%, transparent 40%),
            radial-gradient(circle at 60% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 35%),
            radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 45%)
          `,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        ></div>
      </div>

      {/* Main UI Controls */}
      <div
        className={`transition-all duration-500 ${
          showUI && (uiVisible || !isMobile) ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Close Button - Выровнен с верхним баром */}
        <button
          onClick={onClose}
          className={`absolute z-20 glass hover:bg-red-500/20 hover:scale-110 transition-all duration-300 group touch-manipulation ${
            isMobile 
              ? isLandscape 
                ? "top-2 right-2 rounded-xl h-8 px-3 ml-2" 
                : "top-4 right-4 rounded-xl h-12 px-4 ml-4"
              : "top-6 right-6 rounded-2xl h-12 px-4 ml-4"
          }`}
        >
          <X className={`text-white group-hover:text-red-400 ${
            isMobile && isLandscape ? "w-4 h-4" : "w-5 h-5 md:w-6 md:h-6"
          }`} />
        </button>

        {/* Navigation Buttons - Адаптивное позиционирование */}
        {onPrev && (
          <button
            onClick={onPrev}
            disabled={!canPrev}
            className={`absolute top-1/2 -translate-y-1/2 z-20 glass rounded-xl transition-all duration-300 group touch-manipulation ${
              isMobile
                ? isLandscape 
                  ? "left-1 p-2" 
                  : "left-2 p-3"
                : "left-6 md:rounded-2xl p-3 md:p-4"
            } ${
              !canPrev
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-blue-500/20 hover:scale-110 active:scale-95"
            }`}
          >
            <ChevronLeft className={`text-white group-hover:text-blue-400 ${
              isMobile && isLandscape ? "w-4 h-4" : "w-5 h-5 md:w-8 md:h-8"
            }`} />
          </button>
        )}

        {onNext && (
          <button
            onClick={onNext}
            disabled={!canNext}
            className={`absolute top-1/2 -translate-y-1/2 z-20 glass rounded-xl transition-all duration-300 group touch-manipulation ${
              isMobile
                ? isLandscape 
                  ? "right-1 p-2" 
                  : "right-2 p-3"
                : "right-6 md:rounded-2xl p-3 md:p-4"
            } ${
              !canNext
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-blue-500/20 hover:scale-110 active:scale-95"
            }`}
          >
            <ChevronRight className={`text-white group-hover:text-blue-400 ${
              isMobile && isLandscape ? "w-4 h-4" : "w-5 h-5 md:w-8 md:h-8"
            }`} />
          </button>
        )}

        {/* Mobile Top Bar - С высотой как у кнопки закрытия */}
        {isMobile && (
          <div className={`absolute z-20 ${
            isLandscape 
              ? "top-2 left-2 h-8" 
              : "top-4 left-4 h-12"
          }`} style={{
            right: isLandscape ? '80px' : '96px' // Оставляем место для кнопки закрытия с отступом
          }}>
            <div className={`glass rounded-xl px-3 py-2 flex items-center justify-between h-full ${
              isLandscape ? "text-sm" : ""
            }`}>
              {/* Left side - Compact essential actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-lg transition-all duration-300 touch-manipulation ${
                    isLiked
                      ? "text-red-400 bg-red-400/20"
                      : "text-white/60 hover:text-red-400 hover:bg-red-400/10"
                  }`}
                >
                  <Heart
                    className={isLandscape ? "w-3 h-3" : "w-4 h-4"}
                    fill={isLiked ? "currentColor" : "none"}
                  />
                </button>

                <button
                  onClick={() => setMobileInfoExpanded(!mobileInfoExpanded)}
                  className={`p-2 rounded-lg transition-all duration-300 touch-manipulation ${
                    mobileInfoExpanded
                      ? "text-blue-400 bg-blue-400/20"
                      : "text-white/60 hover:text-blue-400 hover:bg-blue-400/10"
                  }`}
                >
                  {mobileInfoExpanded ? (
                    <ChevronUp className={isLandscape ? "w-3 h-3" : "w-4 h-4"} />
                  ) : (
                    <Info className={isLandscape ? "w-3 h-3" : "w-4 h-4"} />
                  )}
                </button>
              </div>

              {/* Right side - Status info */}
              <div className={`flex items-center space-x-2 text-white/60 ${
                isLandscape ? "text-xs" : "text-xs"
              }`}>
                <span className="font-mono">{Math.round(zoom * 100)}%</span>
                {typeof currentIndex === "number" &&
                  typeof total === "number" && (
                    <>
                      <div className="w-px h-3 bg-white/30"></div>
                      <span>
                        {currentIndex + 1}/{total}
                      </span>
                    </>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Top Action Bar - Показываем только на настоящих десктопах */}
        {!isMobile && (
          <div className="absolute top-6 left-6 flex items-center space-x-3 z-20">
            <div className="glass rounded-2xl px-4 py-2 flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isLiked
                    ? "text-red-400 bg-red-400/20"
                    : "text-white/60 hover:text-red-400 hover:bg-red-400/10"
                }`}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isLiked ? "currentColor" : "none"}
                />
              </button>
              <button className="p-2 rounded-lg text-white/60 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-300">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg text-white/60 hover:text-green-400 hover:bg-green-400/10 transition-all duration-300">
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  showInfo
                    ? "text-blue-400 bg-blue-400/20"
                    : "text-white/60 hover:text-blue-400 hover:bg-blue-400/10"
                }`}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls - Desktop only */}
            <div className="glass rounded-2xl p-2 flex items-center space-x-1">
              <button
                onClick={() => setZoom((prev) => Math.max(prev / 1.2, 0.1))}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-white/60 text-sm font-mono w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((prev) => Math.min(prev * 1.2, 5))}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-white/20 mx-1"></div>
              <button
                onClick={() => setRotation((prev) => prev + 90)}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Expanded Info Panel */}
        {isMobile && (
          <div
            className={`absolute z-20 transition-all duration-300 ${
              isLandscape 
                ? "top-12 left-2 right-2" 
                : "top-20 left-4 right-4"
            } ${
              mobileInfoExpanded
                ? "opacity-100 translate-y-0 max-h-screen"
                : "opacity-0 -translate-y-4 max-h-0 overflow-hidden"
            }`}
          >
            <div className="glass rounded-xl backdrop-blur-xl overflow-hidden">
              {/* Image Info */}
              <div className={`border-b border-white/10 ${
                isLandscape ? "p-3" : "p-4"
              }`}>
                <h3 className={`font-semibold text-white mb-2 truncate ${
                  isLandscape ? "text-base" : "text-lg"
                }`}>
                  {photo.title}
                </h3>
                <p className={`text-white/70 line-clamp-2 mb-3 ${
                  isLandscape ? "text-xs" : "text-sm"
                }`}>
                  {photo.description}
                </p>

                {/* Stats grid */}
                <div className={`grid grid-cols-2 gap-3 ${
                  isLandscape ? "text-xs" : "text-sm"
                }`}>
                  <div className="flex justify-between">
                    <span className="text-white/60">Размер:</span>
                    <span className="text-white">
                      {photo.size ? (photo.size / 1024 / 1024).toFixed(2) : "--"}{" "}
                      МБ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Формат:</span>
                    <span className="text-white">HDR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Качество:</span>
                    <span className="text-green-400 font-medium">Высокое</span>
                  </div>
                  {typeof currentIndex === "number" &&
                    typeof total === "number" && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Позиция:</span>
                        <span className="text-white">
                          {currentIndex + 1} / {total}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {/* Actions */}
              <div className={`flex items-center justify-center space-x-4 ${
                isLandscape ? "p-2" : "p-3"
              }`}>
                <button className="p-2 rounded-lg text-white/60 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-300 touch-manipulation">
                  <Download className={isLandscape ? "w-4 h-4" : "w-5 h-5"} />
                </button>
                <button className="p-2 rounded-lg text-white/60 hover:text-green-400 hover:bg-green-400/10 transition-all duration-300 touch-manipulation">
                  <Share2 className={isLandscape ? "w-4 h-4" : "w-5 h-5"} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Controls */}
        {isMobile && (
          <div
            className={`absolute z-20 ${
              isLandscape
                ? "bottom-2 left-1/2 -translate-x-1/2"
                : "bottom-6 left-4 right-4"
            }`}
          >
            <div className={`glass rounded-xl flex items-center justify-center space-x-4 ${
              isLandscape ? "p-2" : "p-3"
            }`}>
              <button
                onClick={() => setZoom((prev) => Math.max(prev / 1.2, 0.1))}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 touch-manipulation active:scale-95"
              >
                <ZoomOut className={isLandscape ? "w-4 h-4" : "w-5 h-5"} />
              </button>

              <div className={`px-2 py-1 font-mono text-white/70 min-w-[50px] text-center ${
                isLandscape ? "text-xs" : "text-sm"
              }`}>
                {Math.round(zoom * 100)}%
              </div>

              <button
                onClick={() => setZoom((prev) => Math.min(prev * 1.2, 5))}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 touch-manipulation active:scale-95"
              >
                <ZoomIn className={isLandscape ? "w-4 h-4" : "w-5 h-5"} />
              </button>
              <div className="w-px h-6 bg-white/20"></div>
              <button
                onClick={() => setRotation((prev) => prev + 90)}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 touch-manipulation active:scale-95"
              >
                <RotateCw className={isLandscape ? "w-4 h-4" : "w-5 h-5"} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Container - Полноэкранное изображение */}
      <div className="flex justify-center items-center w-full h-full relative overflow-hidden">
        {(!imageLoaded || loading) && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className={`glass rounded-3xl animate-pulse ${
              isMobile && isLandscape ? "p-4" : "p-6 md:p-8"
            }`}>
              <Loader className={`animate-spin text-blue-400 ${
                isMobile && isLandscape ? "w-5 h-5" : "w-6 h-6 md:w-8 md:h-8"
              }`} />
            </div>
          </div>
        )}

        <img
          ref={imgRef}
          src={photo.full}
          alt={photo.title}
          loading="lazy"
          className={`w-full h-full object-contain transition-all duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            filter: "drop-shadow(0 0 40px rgba(59, 130, 246, 0.2))",
          }}
          draggable={false}
          onLoad={() => {
            setImageLoaded(true);
            onImgLoad?.();
          }}
        />
      </div>

      {/* Desktop Bottom Info Panel - Только для десктопов */}
      {!isMobile && (
        <div
          className={`absolute bottom-6 left-6 right-6 z-20 transition-all duration-500 ${
            showUI && uiVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="glass rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">{photo.title}</h2>
                <p className="text-white/70">{photo.description}</p>
                {typeof currentIndex === "number" &&
                  typeof total === "number" && (
                    <div className="flex items-center space-x-4 text-sm text-white/50">
                      <span>
                        {currentIndex + 1} / {total}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-white/30"></div>
                      <span>HDR Quality</span>
                      <div className="w-1 h-1 rounded-full bg-white/30"></div>
                      <span>
                        {photo.size
                          ? (photo.size / 1024 / 1024).toFixed(2)
                          : "--"}{" "}
                        МБ
                      </span>
                    </div>
                  )}
              </div>

              {/* Progress Indicator */}
              {typeof currentIndex === "number" &&
                typeof total === "number" &&
                total > 1 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                        style={{
                          width: `${((currentIndex + 1) / total) * 100}%`,
                        }}
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
      )}

      {/* Desktop Extended Info Panel */}
      {!isMobile && showInfo && (
        <div
          className={`absolute top-20 right-6 w-80 z-20 animate-slide-in transition-all duration-300 ${
            showUI && uiVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="glass rounded-3xl p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Информация о файле
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Название:</span>
                <span className="text-white font-medium">{photo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Размер:</span>
                <span className="text-white">
                  {photo.size ? (photo.size / 1024 / 1024).toFixed(2) : "--"} МБ
                </span>
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
    </div>
  );
};

export default ImageModal;