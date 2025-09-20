import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  isMobile: boolean;
  isLandscape: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrev,
  onNext,
  canPrev,
  canNext,
  isMobile,
  isLandscape,
}) => {
  const buttonClass = `absolute top-1/2 -translate-y-1/2 z-20 glass rounded-xl transition-all duration-300 group touch-manipulation ${
    isMobile ? (isLandscape ? "p-2" : "p-3") : "md:rounded-2xl p-3 md:p-4"
  }`;

  const iconClass = `text-white group-hover:text-blue-400 ${
    isMobile && isLandscape ? "w-4 h-4" : "w-5 h-5 md:w-8 md:h-8"
  }`;

  return (
    <>
      {onPrev && (
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className={`${buttonClass} ${
            isMobile ? (isLandscape ? "left-1" : "left-2") : "left-6"
          } ${
            !canPrev
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-blue-500/20 hover:scale-110 active:scale-95"
          }`}
        >
          <ChevronLeft className={iconClass} />
        </button>
      )}

      {onNext && (
        <button
          onClick={onNext}
          disabled={!canNext}
          className={`${buttonClass} ${
            isMobile ? (isLandscape ? "right-1" : "right-2") : "right-6"
          } ${
            !canNext
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-blue-500/20 hover:scale-110 active:scale-95"
          }`}
        >
          <ChevronRight className={iconClass} />
        </button>
      )}
    </>
  );
};
