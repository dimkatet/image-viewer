import { X } from "lucide-react";

interface CloseButtonProps {
  onClick: () => void;
  isMobile: boolean;
  isLandscape: boolean;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  isMobile,
  isLandscape,
}) => (
  <button
    onClick={onClick}
    className={`absolute z-20 glass hover:bg-red-500/20 hover:scale-110 transition-all duration-300 group touch-manipulation ${
      isMobile
        ? isLandscape
          ? "top-2 right-2 rounded-xl h-10 px-3 ml-2"
          : "top-4 right-4 rounded-xl h-12 px-4 ml-4"
        : "top-6 right-6 rounded-2xl h-12 px-4 ml-4"
    }`}
  >
    <X
      className={`text-white group-hover:text-red-400 ${
        isMobile && isLandscape ? "w-4 h-4" : "w-5 h-5 md:w-6 md:h-6"
      }`}
    />
  </button>
);