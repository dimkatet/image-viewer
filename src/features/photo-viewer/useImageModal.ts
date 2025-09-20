import { useCallback, useEffect, useRef, useState } from "react";
import { SpringValue, useSpring } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";

export const useImageTransform = () => {
  const [{ scale, rotateZ }, api] = useSpring(() => ({
    scale: 1,
    rotateZ: 0,
    config: { tension: 300, friction: 30 },
  }));
  console.log(scale);
  const handleZoomIn = useCallback(() => {
    api.start((_, ctrl) => ({
      scale: Math.min(ctrl.get().scale * 1.2, 5),
    }));
  }, [api]);

  const handleZoomOut = useCallback(() => {
    api.start((_, ctrl) => ({
      scale: Math.max(ctrl.get().scale / 1.2, 0.1),
    }));
  }, [api]);

  const handleRotate = useCallback(() => {
    api.start((_, ctrl) => ({
      rotateZ: ctrl.get().rotateZ + 90,
    }));
  }, [api]);

  const resetTransform = useCallback(() => {
    api.start({ scale: 1, rotateZ: 0 });
  }, [api]);

  const setScale = useCallback((newScale: number) => {
    api.start({ scale: Math.min(Math.max(newScale, 0.1), 5) });
  }, [api]);

  return {
    scale,
    rotateZ,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    resetTransform,
    setScale,
  };
};

export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth <= 768;
      const isLandscapeOrientation = window.innerWidth > window.innerHeight;
      
      setIsMobile(isMobileDevice);
      setIsLandscape(isLandscapeOrientation);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    window.addEventListener("orientationchange", () => {
      setTimeout(checkDevice, 100);
    });

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, []);

  return { isMobile, isLandscape };
};

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleToggleFullscreen = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!isFullscreen) {
      if (modalRef.current) {
        const el = modalRef.current as HTMLElement & {
          webkitRequestFullscreen?: () => void;
        };
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        }
      }
    } else {
      const doc = document as Document & {
        webkitExitFullscreen?: () => void;
        webkitFullscreenElement?: Element;
      };
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (doc.webkitFullscreenElement) {
        if (typeof doc.webkitExitFullscreen === "function") {
          doc.webkitExitFullscreen();
        }
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, handleToggleFullscreen, modalRef };
};

export const useUIVisibility = (isMobile: boolean) => {
  const [uiVisible, setUiVisible] = useState(true);
  const hideUITimeout = useRef<NodeJS.Timeout | null>(null);

  const showUI = useCallback(() => {
    setUiVisible(true);
    if (hideUITimeout.current) clearTimeout(hideUITimeout.current);
    
    const timeout = isMobile ? 4000 : 3000;
    hideUITimeout.current = setTimeout(() => setUiVisible(false), timeout);
  }, [isMobile]);

  const handleMouseMove = useCallback(() => {
    if (isMobile) return;
    showUI();
  }, [isMobile, showUI]);

  useEffect(() => {
    if (isMobile) {
      setUiVisible(false);
    } else {
      const timer = setTimeout(() => setUiVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  useEffect(() => {
    return () => {
      if (hideUITimeout.current) {
        clearTimeout(hideUITimeout.current);
      }
    };
  }, []);

  return { uiVisible, setUiVisible, handleMouseMove, showUI };
};

export const useImageGestures = (
  isMobile: boolean,
  scale: SpringValue<number>,
  setScale: (scale: number) => void,
  onPrev?: () => void,
  onNext?: () => void,
  canPrev?: boolean,
  canNext?: boolean,
  showUI?: () => void
) => {
  const bind = useGesture(
    {
      onDrag: ({ direction: [dx], movement: [mx], cancel, tap }) => {
        if (tap && isMobile) {
          showUI?.();
          return;
        }

        if (Math.abs(mx) < 50) return;

        if (Math.abs(mx) > 50) {
          cancel();
          if (dx > 0 && onPrev && canPrev) {
            onPrev();
          } else if (dx < 0 && onNext && canNext) {
            onNext();
          }
        }
      },

      onWheel: ({ event, delta: [, dy] }) => {
        if (isMobile) return;
        event.preventDefault();

        const factor = dy > 0 ? 0.9 : 1.1;
        const currentScale = scale.get();
        setScale(currentScale * factor);
      },

      onPinch: ({ offset: [d], memo = scale.get() }) => {
        const newScale = Math.min(Math.max(memo * d, 0.1), 5);
        setScale(newScale);
        return memo;
      },
    },
    {
      drag: {
        filterTaps: true,
        threshold: [10, 10],
        rubberband: true,
      },
      pinch: {
        scaleBounds: { min: 0.1, max: 5 },
        rubberband: true,
      },
      wheel: {
        eventOptions: { passive: false },
      },
    }
  );

  return bind;
};

export const useKeyboardNavigation = (
  onClose: () => void,
  onPrev?: () => void,
  onNext?: () => void,
  canPrev?: boolean,
  canNext?: boolean,
  showInfo?: boolean,
  setShowInfo?: (show: boolean) => void,
  handleZoomIn?: () => void,
  handleZoomOut?: () => void,
  handleRotate?: () => void
) => {
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
          if (setShowInfo && typeof showInfo === "boolean") {
            setShowInfo(!showInfo);
          }
          break;
        case "+":
        case "=":
          handleZoomIn?.();
          break;
        case "-":
          handleZoomOut?.();
          break;
        case "r":
        case "R":
          handleRotate?.();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onClose,
    onPrev,
    onNext,
    canPrev,
    canNext,
    showInfo,
    setShowInfo,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
  ]);
};