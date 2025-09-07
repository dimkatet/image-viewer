import { Photo } from "@/utils/api";
import Image from "next/image";
import { Download, Eye, Heart, Share2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface FileGalleryProps {
  photos: Photo[];
  viewMode: "list" | "grid";
  onOpen: (photo: Photo, idx: number) => void;
}

const FileGallery: React.FC<FileGalleryProps> = ({
  photos,
  viewMode,
  onOpen,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLike = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const lastImageElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (!mounted) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Дополнительная логика для ленивой загрузки если нужно
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "50px",
        }
      );
      if (node) observerRef.current.observe(node);
    },
    [mounted]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="glass rounded-3xl p-12 text-center animate-scale-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 flex items-center justify-center">
            <Eye className="w-12 h-12 text-blue-400/60" />
          </div>
          <h3 className="text-xl font-semibold text-white/80 mb-2">
            Галерея пуста
          </h3>
          <p className="text-white/50">Добавьте изображения, чтобы начать</p>
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            className="glass rounded-2xl p-4 glass-hover cursor-pointer group animate-slide-in"
            style={{ animationDelay: `${idx * 0.1}s` }}
            onClick={() => onOpen(photo, idx)}
            onMouseEnter={() => mounted && setHoveredId(photo.id)}
            onMouseLeave={() => mounted && setHoveredId(null)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-2 ring-white/10 group-hover:ring-blue-400/50 transition-all duration-300">
                  <Image
                    src={photo.url}
                    alt={photo.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                    loading="lazy"
                    quality={75}
                  />
                  <div
                    className={`absolute inset-0 rounded-xl bg-blue-500/20 transition-opacity duration-300 ${
                      mounted && hoveredId === photo.id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {photo.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-white/50">
                    <span>
                      {photo.size
                        ? (photo.size / 1024 / 1024).toFixed(2)
                        : "--"}{" "}
                      МБ
                    </span>
                    <span>HDR</span>
                  </div>
                </div>
              </div>

              {mounted && (
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => toggleLike(photo.id, e)}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      likedPhotos.has(photo.id)
                        ? "text-red-400 bg-red-400/20"
                        : "text-white/40 hover:text-red-400 hover:bg-red-400/10"
                    }`}
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={likedPhotos.has(photo.id) ? "currentColor" : "none"}
                    />
                  </button>
                  <button className="p-2 rounded-xl text-white/40 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-200">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl text-white/40 hover:text-green-400 hover:bg-green-400/10 transition-all duration-200">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="btn-primary px-4 py-2 text-sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Открыть
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {photos.map((photo, idx) => (
        <div
          key={photo.id}
          className="glass rounded-2xl overflow-hidden glass-hover cursor-pointer group animate-scale-in"
          style={{ animationDelay: `${idx * 0.1}s` }}
          onClick={() => onOpen(photo, idx)}
          onMouseEnter={() => mounted && setHoveredId(photo.id)}
          onMouseLeave={() => mounted && setHoveredId(null)}
          ref={idx === photos.length - 1 ? lastImageElementRef : null}
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={photo.url} // Используем оригинальный URL
              alt={photo.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover"
              priority={idx < 4} // Приоритет для первых 4 изображений
              quality={80} // Хорошее качество для preview
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Action buttons overlay */}
            {mounted && (
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  hoveredId === photo.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => toggleLike(photo.id, e)}
                    className={`p-3 rounded-full backdrop-blur-md transition-all duration-200 ${
                      likedPhotos.has(photo.id)
                        ? "bg-red-500/30 text-red-400 scale-110"
                        : "bg-white/10 text-white hover:bg-red-500/30 hover:text-red-400"
                    }`}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={likedPhotos.has(photo.id) ? "currentColor" : "none"}
                    />
                  </button>
                  <button className="p-3 rounded-full bg-blue-500/30 text-blue-300 backdrop-blur-md hover:bg-blue-500/50 transition-all duration-200 scale-110">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-full bg-white/10 text-white hover:bg-green-500/30 hover:text-green-400 backdrop-blur-md transition-all duration-200">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* HDR Badge */}
            <div className="absolute top-3 left-3">
              <span className="glass text-xs font-semibold px-2 py-1 rounded-lg text-blue-300 border border-blue-400/30">
                HDR
              </span>
            </div>

            {/* Like indicator */}
            {mounted && likedPhotos.has(photo.id) && (
              <div className="absolute top-3 right-3">
                <Heart className="w-5 h-5 text-red-400" fill="currentColor" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-semibold text-white mb-2 truncate group-hover:text-blue-300 transition-colors">
              {photo.name}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">
                {photo.size ? (photo.size / 1024 / 1024).toFixed(2) : "--"} МБ
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/60">Готов</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGallery;
