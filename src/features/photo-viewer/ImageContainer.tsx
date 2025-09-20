import { Loader } from "lucide-react";
import { animated, SpringValue } from "@react-spring/web";
import Image from "next/image";
import { Photo } from "@/utils/api";
import { ReactDOMAttributes } from "@use-gesture/react/dist/declarations/src/types";

interface ImageContainerProps {
  photo: Photo;
  imageLoaded: boolean;
  loading: boolean;
  isMobile: boolean;
  isLandscape: boolean;
  scale: SpringValue<number>;
  rotateZ: SpringValue<number>;
  onImageLoad: () => void;
  gestureBinds: (...args: unknown[]) => ReactDOMAttributes;
}

export const ImageContainer: React.FC<ImageContainerProps> = ({
  photo,
  imageLoaded,
  loading,
  isMobile,
  isLandscape,
  scale,
  rotateZ,
  onImageLoad,
  gestureBinds,
}) => (
  <div
    className="flex justify-center items-center w-full h-full relative overflow-hidden"
    {...gestureBinds}
    style={{ touchAction: "none" }}
  >
    {(!imageLoaded || loading) && (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className={`glass rounded-3xl animate-pulse ${
            isMobile && isLandscape ? "p-4" : "p-6 md:p-8"
          }`}
        >
          <Loader
            className={`animate-spin text-blue-400 ${
              isMobile && isLandscape ? "w-5 h-5" : "w-6 h-6 md:w-8 md:h-8"
            }`}
          />
        </div>
      </div>
    )}

    <animated.div className="relative w-full h-full">
      <animated.div
        style={{
          transform: scale.to((s) => `scale(${s})`),
          rotate: rotateZ.to((r) => `${r}deg`),
        }}
        className="w-full h-full relative"
      >
        <Image
          fill
          priority
          unoptimized
          quality={100}
          src={photo.url}
          alt={photo.name}
          sizes="100vw"
          className={`object-contain transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            filter: "drop-shadow(0 0 40px rgba(59, 130, 246, 0.2))",
          }}
          onLoad={onImageLoad}
          onError={() => {
            console.error("Failed to load image:", photo.url);
          }}
        />
      </animated.div>
    </animated.div>
  </div>
);
