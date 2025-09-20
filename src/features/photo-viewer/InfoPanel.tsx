import { Photo } from "@/utils/api";
import { Download, Share2 } from "lucide-react";

interface InfoPanelProps {
  photo: Photo;
  currentIndex?: number;
  total?: number;
  variant: 'desktop' | 'mobile-expanded';
  isLandscape?: boolean;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  photo,
  currentIndex,
  total,
  variant,
  isLandscape = false,
}) => {
  const fileSize = photo.size ? (photo.size / 1024 / 1024).toFixed(2) : "--";

  if (variant === 'desktop') {
    return (
      <div className="glass rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">{photo.name}</h2>
            <p className="text-white/70">{photo.name}</p>
            {typeof currentIndex === "number" && typeof total === "number" && (
              <div className="flex items-center space-x-4 text-sm text-white/50">
                <span>{currentIndex + 1} / {total}</span>
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <span>HDR Quality</span>
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <span>{fileSize} МБ</span>
              </div>
            )}
          </div>

          {typeof currentIndex === "number" && typeof total === "number" && total > 1 && (
            <div className="flex items-center space-x-2">
              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                />
              </div>
              <span className="text-white/60 text-sm font-mono">
                {currentIndex + 1}/{total}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'mobile-expanded') {
    return (
      <div className="glass rounded-xl backdrop-blur-xl overflow-hidden">
        <div className={`border-b border-white/10 ${isLandscape ? "p-3" : "p-4"}`}>
          <h3 className={`font-semibold text-white mb-2 truncate ${isLandscape ? "text-base" : "text-lg"}`}>
            {photo.name}
          </h3>
          <p className={`text-white/70 line-clamp-2 mb-3 ${isLandscape ? "text-xs" : "text-sm"}`}>
            {photo.name}
          </p>

          <div className={`grid grid-cols-2 gap-3 ${isLandscape ? "text-xs" : "text-sm"}`}>
            <div className="flex justify-between">
              <span className="text-white/60">Размер:</span>
              <span className="text-white">{fileSize} МБ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Формат:</span>
              <span className="text-white">HDR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Качество:</span>
              <span className="text-green-400 font-medium">Высокое</span>
            </div>
            {typeof currentIndex === "number" && typeof total === "number" && (
              <div className="flex justify-between">
                <span className="text-white/60">Позиция:</span>
                <span className="text-white">{currentIndex + 1} / {total}</span>
              </div>
            )}
          </div>
        </div>

        <div className={`flex items-center justify-center space-x-4 ${isLandscape ? "p-2" : "p-3"}`}>
          <button className="p-2 rounded-lg text-white/60 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-300 touch-manipulation">
            <Download className={isLandscape ? "w-4 h-4" : "w-5 h-5"} />
          </button>
          <button className="p-2 rounded-lg text-white/60 hover:text-green-400 hover:bg-green-400/10 transition-all duration-300 touch-manipulation">
            <Share2 className={isLandscape ? "w-4 h-4" : "w-5 h-5"} />
          </button>
        </div>
      </div>
    );
  }

  return null;
};