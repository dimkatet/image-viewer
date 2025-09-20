import { Photo } from "@/utils/api";

interface ExtendedInfoPanelProps {
  photo: Photo;
  showInfo: boolean;
  uiVisible: boolean;
}

export const ExtendedInfoPanel: React.FC<ExtendedInfoPanelProps> = ({
  photo,
  showInfo,
  uiVisible,
}) => {
  const fileSize = photo.size ? (photo.size / 1024 / 1024).toFixed(2) : "--";

  if (!showInfo) return null;

  return (
    <div
      className={`absolute top-20 right-6 w-80 z-20 animate-slide-in transition-all duration-300 ${
        uiVisible ? "opacity-100" : "opacity-0"
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
        </div>
      </div>
    </div>
  );
};