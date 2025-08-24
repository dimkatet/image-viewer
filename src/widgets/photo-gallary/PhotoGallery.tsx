import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import GalleryWithControls from "@/features/file-gallery/GalleryWithControls";
import { ImagesContext } from "@/components/ImagesLayout";
import { Photo } from "@/utils/storage";

interface PhotoGalleryProps {
  title: string;
}

export default function PhotoGallery({ title }: PhotoGalleryProps) {
  const { photos, loading } = useContext(ImagesContext);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const openViewer = (photo: Photo) => {
    router.push(`/${title}/${photo.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-3xl p-8 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-spin"></div>
            <span className="text-xl font-light text-white/80">
              Загружается магия...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/2 w-64 h-64 bg-cyan-500/12 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <header
        className={`relative z-10 backdrop-blur-xl border-b border-white/10 transition-all duration-1000 ${
          isVisible ? "animate-fade-in" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <h1 className="text-4xl font-bold gradient-text floating">
                  {title.toUpperCase()} Галерея
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full opacity-60"></div>
              </div>
              <div
                className="glass rounded-2xl px-4 py-2 animate-slide-in"
                style={{ animationDelay: "0.3s" }}
              >
                <span className="text-white/70 font-medium">
                  {photos.length} изображений
                </span>
              </div>
            </div>

            {/* Статистика */}
            <div className="hidden md:flex space-x-4">
              <div className="glass rounded-2xl px-4 py-3 text-center min-w-[80px] glass-hover">
                <div className="text-2xl font-bold text-blue-400">
                  {photos.length}
                </div>
                <div className="text-xs text-white/60">Всего</div>
              </div>
              <div className="glass rounded-2xl px-4 py-3 text-center min-w-[80px] glass-hover">
                <div className="text-2xl font-bold text-purple-400">
                  {title.toUpperCase()}
                </div>
                <div className="text-xs text-white/60">Качество</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`relative z-10 max-w-6xl mx-auto px-6 py-12 transition-all duration-1000 ${
          isVisible ? "animate-fade-in" : "opacity-0"
        }`}
        style={{ animationDelay: "0.2s" }}
      >
        <div className="glass rounded-3xl p-8 backdrop-blur-xl">
          <GalleryWithControls photos={photos} onOpen={openViewer} />
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-20">
        <button className="glass rounded-full p-4 glass-hover group">
          <svg
            className="w-6 h-6 text-white group-hover:rotate-180 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>

      {/* Ambient Light Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-blue-400/50 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-24 bg-gradient-to-b from-purple-400/30 to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 w-px h-20 bg-gradient-to-t from-cyan-400/40 to-transparent"></div>
      </div>
    </div>
  );
}
