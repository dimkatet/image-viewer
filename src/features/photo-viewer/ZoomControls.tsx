import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { animated, SpringValue } from "@react-spring/web";

interface ZoomControlsProps {
  scale: SpringValue<number>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  isMobile: boolean;
  isLandscape: boolean;
  variant?: "desktop" | "mobile";
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onRotate,
  isMobile,
  isLandscape,
  variant = "desktop",
}) => {

  if (variant === "desktop") {
    return (
      <div className="glass rounded-2xl p-2 flex items-center space-x-1">
        <button
          onClick={onZoomOut}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <animated.span className="text-white/60 text-sm font-mono w-12 text-center">
          {Math.round(scale.get() * 100)}%
        </animated.span>
        <button
          onClick={onZoomIn}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-white/20 mx-1" />
        <button
          onClick={onRotate}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`glass rounded-xl flex items-center justify-center space-x-4 ${
        isLandscape ? "p-2" : "p-3"
      }`}
    >
      <button
        onClick={onZoomOut}
        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 touch-manipulation active:scale-95"
      >
        <ZoomOut className={isLandscape ? "w-4 h-4" : "w-5 h-5"} />
      </button>

      <animated.div
        className={`px-2 py-1 font-mono text-white/70 min-w-[50px] text-center ${
          isLandscape ? "text-xs" : "text-sm"
        }`}
      >
        {Math.round(scale.get() * 100)}%
      </animated.div>

      <button
        onClick={onZoomIn}
        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 touch-manipulation active:scale-95"
      >
        <ZoomIn className={isLandscape ? "w-4 h-4" : "w-5 h-5"} />
      </button>
      <div className="w-px h-6 bg-white/20" />
      <button
        onClick={onRotate}
        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 touch-manipulation active:scale-95"
      >
        <RotateCw className={isLandscape ? "w-4 h-4" : "w-5 h-5"} />
      </button>
    </div>
  );
};
