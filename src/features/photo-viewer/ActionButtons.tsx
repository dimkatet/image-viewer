import { Heart, Download, Share2, Info, Maximize2, Minimize2 } from "lucide-react";

interface ActionButtonsProps {
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isMobile?: boolean;
  isLandscape?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isLiked,
  setIsLiked,
  showInfo,
  setShowInfo,
  isFullscreen,
  onToggleFullscreen,
  isMobile = false,
  isLandscape = false,
}) => {
  const iconSize = isMobile && isLandscape ? "w-3 h-3" : "w-4 h-4";

  return (
    <>
      <button
        onClick={() => setIsLiked(!isLiked)}
        className={`p-2 rounded-lg transition-all duration-300 ${
          isMobile ? "touch-manipulation" : ""
        } ${
          isLiked
            ? "text-red-400 bg-red-400/20"
            : "text-white/60 hover:text-red-400 hover:bg-red-400/10"
        }`}
      >
        <Heart
          className={iconSize}
          fill={isLiked ? "currentColor" : "none"}
        />
      </button>

      {!isMobile && (
        <>
          <button className="p-2 rounded-lg text-white/60 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-300">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-white/60 hover:text-green-400 hover:bg-green-400/10 transition-all duration-300">
            <Share2 className="w-4 h-4" />
          </button>
        </>
      )}

      <button
        onClick={() => setShowInfo(!showInfo)}
        className={`p-2 rounded-lg transition-all duration-300 ${
          isMobile ? "touch-manipulation" : ""
        } ${
          showInfo
            ? "text-blue-400 bg-blue-400/20"
            : "text-white/60 hover:text-blue-400 hover:bg-blue-400/10"
        }`}
      >
        <Info className={iconSize} />
      </button>

      <button
        onClick={onToggleFullscreen}
        className={`p-2 rounded-lg transition-all duration-300 ${
          isMobile ? "touch-manipulation" : ""
        } text-white/60 hover:text-yellow-400 hover:bg-yellow-400/10`}
      >
        {isFullscreen ? (
          <Minimize2 className={iconSize} />
        ) : (
          <Maximize2 className={iconSize} />
        )}
      </button>
    </>
  );
};