import GalleryWithControls from "@/features/file-gallery/GalleryWithControls";
import ImageModal from "@/features/photo-viewer/ImageModal";
import ViewModalSkeleton from "@/features/photo-viewer/ViewModalSkeleton";
import { Photo } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface PhotoGalleryProps {
  title: string;
  photos: Photo[];
}

export default function PhotoGallery({ title, photos }: PhotoGalleryProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );
  const [modalLoading, setModalLoading] = useState(false);

  // Получаем ID из query параметров
  const photoId = router.query.photo as string;
  const isModalOpen = !!photoId;

  // Инициализация после монтирования
  useEffect(() => {
    setMounted(true);
    setIsVisible(true);
  }, []);

  // Находим текущее фото и его индекс
  const currentIndex = photos.findIndex(
    (p) => String(p.id) === String(photoId)
  );
  const currentPhoto = currentIndex >= 0 ? photos[currentIndex] : null;

  // Предзагрузка соседних изображений - только на клиенте
  const preloadAdjacentImages = (index: number) => {
    if (typeof window === "undefined") return;

    const imagesToPreload: string[] = [];

    // Предзагружаем предыдущее и следующее изображение
    if (index > 0) imagesToPreload.push(photos[index - 1].url);
    if (index < photos.length - 1) imagesToPreload.push(photos[index + 1].url);

    // Предзагружаем еще по одному в каждую сторону для плавной навигации
    if (index > 1) imagesToPreload.push(photos[index - 2].url);
    if (index < photos.length - 2) imagesToPreload.push(photos[index + 2].url);

    imagesToPreload.forEach((src) => {
      if (!preloadedImages.has(src)) {
        const img = new Image();
        img.onload = () => {
          setPreloadedImages((prev) => new Set(prev).add(src));
        };
        img.src = src;
      }
    });
  };

  // Предзагрузка при открытии модала или смене фото - только после монтирования
  useEffect(() => {
    if (mounted && currentIndex >= 0) {
      preloadAdjacentImages(currentIndex);
    }
  }, [currentIndex, photos, mounted]);

  // Функции навигации
  const openViewer = (photo: Photo) => {
    setModalLoading(true);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, photo: photo.id },
      },
      undefined,
      { shallow: true }
    );
  };

  const closeViewer = () => {
    const { photo, ...restQuery } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: restQuery,
      },
      undefined,
      { shallow: true }
    );
    setModalLoading(false);
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      const prevPhoto = photos[currentIndex - 1];
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, photo: prevPhoto.id },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const goNext = () => {
    if (currentIndex < photos.length - 1) {
      const nextPhoto = photos[currentIndex + 1];
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, photo: nextPhoto.id },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  // return <>страница 10</>

  // Обработка клавиш для навигации - только после монтирования и когда модал закрыт
  useEffect(() => {
    if (!mounted || isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && photos.length > 0) {
        openViewer(photos[0]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mounted, isModalOpen, photos]);

  // Обработка загрузки изображения в модале
  const handleModalImageLoad = () => {
    setModalLoading(false);
  };

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
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-10">
              <button
                onClick={() => router.push("/")}
                className="glass rounded-2xl px-4 py-3 glass-hover group transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-white/70 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="text-white/70 group-hover:text-white font-medium transition-colors">
                    Главная
                  </span>
                </div>
              </button>
              <div className="relative">
                <h1 className="text-4xl font-bold gradient-text floating">
                  {title.toUpperCase()} Галерея
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full opacity-60"></div>
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
              {preloadedImages.size > 0 && (
                <div className="glass rounded-2xl px-4 py-3 text-center min-w-[80px] glass-hover">
                  <div className="text-2xl font-bold text-green-400/80">
                    {preloadedImages.size}
                  </div>
                  <div className="text-xs text-white/60">Загружено</div>
                </div>
              )}
              <div className="glass rounded-2xl px-4 py-3 text-center min-w-[80px] glass-hover">
                <div className="text-2xl font-bold text-purple-400">
                  {title.toUpperCase()}
                </div>
                <div className="text-xs text-white/60">Качество</div>
              </div>
              {currentPhoto && (
                <div className="glass rounded-2xl px-4 py-3 text-center min-w-[100px] glass-hover">
                  <div className="text-lg font-bold text-cyan-400">
                    {currentIndex + 1}/{photos.length}
                  </div>
                  <div className="text-xs text-white/60">Просмотр</div>
                </div>
              )}
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

      {/* Modal для просмотра изображений */}
      {isModalOpen && (
        <>
          {!currentPhoto ? (
            <ViewModalSkeleton />
          ) : (
            <ImageModal
              photo={currentPhoto}
              onClose={closeViewer}
              loading={modalLoading}
              onImgLoad={handleModalImageLoad}
              onPrev={currentIndex > 0 ? goPrev : undefined}
              onNext={currentIndex < photos.length - 1 ? goNext : undefined}
              canPrev={currentIndex > 0}
              canNext={currentIndex < photos.length - 1}
              currentIndex={currentIndex}
              total={photos.length}
            />
          )}
        </>
      )}

      {/* Floating Action Button с индикатором предзагрузки */}
      <div className="fixed bottom-8 right-8 z-20">
        <div className="relative">
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

          {/* Кольцо прогресса предзагрузки */}
          {photos.length > 0 && (
            <div className="absolute inset-0 rounded-full">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-white/10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-green-400"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${
                    (preloadedImages.size / Math.min(photos.length, 10)) * 100
                  }, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Подсказка о навигации */}
      {!isModalOpen && photos.length > 0 && (
        <div className="fixed bottom-8 left-8 z-20">
          <div className="glass rounded-2xl px-4 py-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <span className="text-white/60 text-sm">
              Нажмите → чтобы начать просмотр
            </span>
          </div>
        </div>
      )}

      {/* Ambient Light Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-blue-400/50 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-24 bg-gradient-to-b from-purple-400/30 to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 w-px h-20 bg-gradient-to-t from-cyan-400/40 to-transparent"></div>
      </div>
    </div>
  );
}
