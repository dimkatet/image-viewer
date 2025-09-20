import { Heart, Info, ChevronUp, Maximize2, Minimize2 } from "lucide-react";
import { animated, SpringValue } from "@react-spring/web";

interface MobileTopBarProps {
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  mobileInfoExpanded: boolean;
  setMobileInfoExpanded: (expanded: boolean) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  scale: SpringValue<number>;
  currentIndex?: number;
  total?: number;
  isLandscape: boolean;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  isLiked,
  setIsLiked,
  mobileInfoExpanded,
  setMobileInfoExpanded,
  isFullscreen,
  onToggleFullscreen,
  scale,
  currentIndex,
  total,
  isLandscape,
}) => {
  const iconSize = isLandscape ? "w-3 h-3" : "w-4 h-4";
  const textSize = isLandscape ? "text-xs" : "text-xs";

  return (
    <div
      className={`absolute z-20 ${
        isLandscape ? "top-2 left-2 h-10" : "top-4 left-4 h-12"
      }`}
      style={{ right: isLandscape ? "56px" : "80px" }}
    >
      <div
        className={`glass rounded-xl px-3 py-2 flex items-center justify-between h-full ${
          isLandscape ? "text-sm" : ""
        }`}
      >
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
              className={iconSize}
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
              <ChevronUp className={iconSize} />
            ) : (
              <Info className={iconSize} />
            )}
          </button>

          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg transition-all duration-300 touch-manipulation text-white/60 hover:text-yellow-400 hover:bg-yellow-400/10"
          >
            {isFullscreen ? (
              <Minimize2 className={iconSize} />
            ) : (
              <Maximize2 className={iconSize} />
            )}
          </button>
        </div>
        <animated.div
          className={`flex items-center space-x-2 text-white/60 ${textSize}`}
        >
          <span className="font-mono">
            {Math.round(scale.get() * 100)}%
          </span>
          {typeof currentIndex === "number" && typeof total === "number" && (
            <>
              <div className="w-px h-3 bg-white/30" />
              <span>
                {currentIndex + 1}/{total}
              </span>
            </>
          )}
        </animated.div>
      </div>
    </div>
  );
};
