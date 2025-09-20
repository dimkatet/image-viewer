
import React, { useState, useEffect } from "react";
import { Photo } from "@/utils/api";
import {
  useImageTransform,
  useDeviceDetection,
  useFullscreen,
  useUIVisibility,
  useImageGestures,
  useKeyboardNavigation,
} from "./useImageModal";
import { CloseButton } from "./CloseButton";
import { NavigationButtons } from "./NavigationButtons";
import { MobileTopBar } from "./MobileTopBar";
import { DesktopActionBar } from "./DesktopActionBar";
import { InfoPanel } from "./InfoPanel";
import { ExtendedInfoPanel } from "./ExtendedInfoPanel";
import { ZoomControls } from "./ZoomControls";
import { ImageContainer } from "./ImageContainer";
import { BackgroundPattern } from "./BackgroundPattern";

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
  // Local state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [mobileInfoExpanded, setMobileInfoExpanded] = useState(false);

  // Custom hooks
  const { isMobile, isLandscape } = useDeviceDetection();
  const { isFullscreen, handleToggleFullscreen, modalRef } = useFullscreen();
  const { uiVisible, handleMouseMove, showUI: showUIHandler } = useUIVisibility(isMobile);
  
  const {
    scale,
    rotateZ,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    resetTransform,
    setScale,
  } = useImageTransform();

  const gestureBinds = useImageGestures(
    isMobile,
    scale,
    setScale,
    onPrev,
    onNext,
    canPrev,
    canNext,
    showUIHandler
  );

  // Keyboard navigation
  useKeyboardNavigation(
    onClose,
    onPrev,
    onNext,
    canPrev,
    canNext,
    showInfo,
    setShowInfo,
    handleZoomIn,
    handleZoomOut,
    handleRotate
  );

  // Reset state when photo changes
  useEffect(() => {
    setImageLoaded(false);
    setMobileInfoExpanded(false);
    resetTransform();
  }, [photo.url, resetTransform]);

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
    onImgLoad?.();
  };

  const shouldShowUI = showUI && (uiVisible || !isMobile);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 select-none animate-fade-in"
      onMouseMove={handleMouseMove}
    >
      <BackgroundPattern />

      {/* UI Controls */}
      <div
        className={`transition-all duration-500 ${
          shouldShowUI ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <CloseButton
          onClick={onClose}
          isMobile={isMobile}
          isLandscape={isLandscape}
        />

        <NavigationButtons
          onPrev={onPrev}
          onNext={onNext}
          canPrev={canPrev}
          canNext={canNext}
          isMobile={isMobile}
          isLandscape={isLandscape}
        />

        {isMobile ? (
          <MobileTopBar
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            mobileInfoExpanded={mobileInfoExpanded}
            setMobileInfoExpanded={setMobileInfoExpanded}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            scale={scale}
            currentIndex={currentIndex}
            total={total}
            isLandscape={isLandscape}
          />
        ) : (
          <DesktopActionBar
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            showInfo={showInfo}
            setShowInfo={setShowInfo}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            scale={scale}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onRotate={handleRotate}
          />
        )}

        {/* Mobile Expanded Info */}
        {isMobile && (
          <div
            className={`absolute z-20 transition-all duration-300 ${
              isLandscape ? "top-12 left-2 right-2" : "top-20 left-4 right-4"
            } ${
              mobileInfoExpanded
                ? "opacity-100 translate-y-0 max-h-screen"
                : "opacity-0 -translate-y-4 max-h-0 overflow-hidden"
            }`}
          >
            <InfoPanel
              photo={photo}
              currentIndex={currentIndex}
              total={total}
              variant="mobile-expanded"
              isLandscape={isLandscape}
            />
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
            <ZoomControls
              scale={scale}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onRotate={handleRotate}
              isMobile={isMobile}
              isLandscape={isLandscape}
              variant="mobile"
            />
          </div>
        )}
      </div>

      {/* Image Container */}
      <ImageContainer
        photo={photo}
        imageLoaded={imageLoaded}
        loading={loading}
        isMobile={isMobile}
        isLandscape={isLandscape}
        scale={scale}
        rotateZ={rotateZ}
        onImageLoad={handleImageLoad}
        gestureBinds={gestureBinds}
      />

      {/* Desktop Bottom Info */}
      {!isMobile && (
        <div
          className={`absolute bottom-6 left-6 right-6 z-20 transition-all duration-500 ${
            shouldShowUI
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <InfoPanel
            photo={photo}
            currentIndex={currentIndex}
            total={total}
            variant="desktop"
          />
        </div>
      )}

      {/* Desktop Extended Info */}
      {!isMobile && (
        <ExtendedInfoPanel
          photo={photo}
          showInfo={showInfo}
          uiVisible={uiVisible}
        />
      )}
    </div>
  );
};

export default ImageModal;