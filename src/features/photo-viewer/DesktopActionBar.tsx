import { SpringValue } from "@react-spring/web";
import { ActionButtons } from "./ActionButtons";
import { ZoomControls } from "./ZoomControls";

interface DesktopActionBarProps {
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  scale: SpringValue<number>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
}

export const DesktopActionBar: React.FC<DesktopActionBarProps> = ({
  isLiked,
  setIsLiked,
  showInfo,
  setShowInfo,
  isFullscreen,
  onToggleFullscreen,
  scale,
  onZoomIn,
  onZoomOut,
  onRotate,
}) => (
  <div className="absolute top-6 left-6 flex items-center space-x-3 z-20">
    <div className="glass rounded-2xl px-4 py-2 flex items-center space-x-3">
      <ActionButtons
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
      />
    </div>

    <ZoomControls
      scale={scale}
      onZoomIn={onZoomIn}
      onZoomOut={onZoomOut}
      onRotate={onRotate}
      isMobile={false}
      isLandscape={false}
      variant="desktop"
    />
  </div>
);
