"use client";
import { createClient } from "@supabase/supabase-js";
import { ImageIcon, Loader, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Photo, transformStorageData } from "../utils/storage";
import ImageModal from "../widgets/photo-viewer/ImageModal";
import ViewControls from "../widgets/file-gallery/ViewControls";
import FileGallery from "../widgets/file-gallery/FileGallery";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const BUCKET_NAME = process.env.NEXT_PUBLIC_BUCKET_NAME!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PAGE_SIZE_OPTIONS = [8, 12, 20, 40];

const PhotoViewer = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  // Для хранения ссылок на предзагруженные изображения
  const [preloaded, setPreloaded] = useState<{ [url: string]: boolean }>({});
  const [page, setPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);

  // Получить только нужную страницу
  const paginatedPhotos = photos.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(photos.length / pageSize);

  // Загрузка фотографий через Supabase SDK
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list("", { limit: 1000 });
      if (error) throw error;
      const transformedPhotos = transformStorageData(
        data ?? [],
        SUPABASE_URL,
        BUCKET_NAME
      );
      setPhotos(transformedPhotos);
    } catch (error) {
      console.error("Ошибка загрузки фотографий:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  };
  // --- UI автоскрытие ---
  const [showUI, setShowUI] = useState(true);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  // Показывать UI при движении мыши, скрывать через 2.5 сек
  useEffect(() => {
    const handleMove = () => {
      setShowUI(true);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(() => setShowUI(false), 2500);
    };
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openViewer = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index + (page - 1) * pageSize);
    if (preloaded[photo.full]) {
      setImageLoading(false);
    } else {
      setImageLoading(true);
    }
  };

  const closeViewer = () => {
    setSelectedPhoto(null);
  };

  const goToNext = () => {
    if (currentIndex < photos.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
      if (preloaded[photos[newIndex].full]) {
        setImageLoading(false);
      } else {
        setImageLoading(true);
      }
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
      if (preloaded[photos[newIndex].full]) {
        setImageLoading(false);
      } else {
        setImageLoading(true);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!selectedPhoto) return;
    if (e.key === "Escape") closeViewer();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "ArrowLeft") goToPrev();
  };

  // Предзагрузка следующего и предыдущего изображений
  useEffect(() => {
    if (!selectedPhoto) return;
    const preload = (url: string) => {
      if (preloaded[url]) return;
      const img = new window.Image();
      img.src = url;
      img.onload = () => setPreloaded((prev) => ({ ...prev, [url]: true }));
    };
    // Текущее
    preload(selectedPhoto.full);
    // Следующее
    if (photos[currentIndex + 1]) preload(photos[currentIndex + 1].full);
    // Предыдущее
    if (photos[currentIndex - 1]) preload(photos[currentIndex - 1].full);

    // Если selectedPhoto поменялся и уже предзагружен, imageLoading сбрасываем
    if (preloaded[selectedPhoto.full]) {
      setImageLoading(false);
    }
  }, [selectedPhoto, currentIndex, photos, preloaded]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPhoto, currentIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">
            Загрузка фотографий из Supabase Storage...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <X className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Ошибка загрузки
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPhotos}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Попробовать снова
          </button>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
            <p className="text-sm text-yellow-800">
              <strong>Убедитесь что:</strong>
            </p>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• API ключ указан корректно</li>
              <li>• У вас есть права доступа к storage</li>
              <li>• Bucket &apos;avif-hdr-images&apos; существует</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  HDR Галерея
                </h1>
                <p className="text-gray-600 mt-1">
                  Найдено {photos.length} изображений
                </p>
              </div>
            </div>
            <button
              onClick={fetchPhotos}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Loader className="w-4 h-4" />
              Обновить
            </button>
          </div>
        </div>
      </header>

      {/* Controls: View mode and page size */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <ViewControls
          viewMode={viewMode}
          setViewMode={setViewMode}
          pageSize={pageSize}
          setPageSize={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
        />

        <FileGallery
          photos={paginatedPhotos}
          viewMode={viewMode}
          onOpen={openViewer}
        />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? "bg-gray-200 text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Назад
            </button>
            <span className="text-gray-700">
              Страница {page} из {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Вперёд
            </button>
          </div>
        )}
      </main>

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <ImageModal
          photo={selectedPhoto}
          currentIndex={currentIndex}
          total={photos.length}
          onClose={closeViewer}
          onPrev={goToPrev}
          onNext={goToNext}
          loading={imageLoading}
          showUI={showUI}
          canPrev={currentIndex > 0}
          canNext={currentIndex < photos.length - 1}
          onImgLoad={() => imageLoading && setImageLoading(false)}
        />
      )}
    </div>
  );
};

export default PhotoViewer;
