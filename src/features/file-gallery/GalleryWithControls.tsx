import { useState } from "react";
import ViewControls from "./ViewControls";
import FileGallery from "./FileGallery";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Photo } from "@/utils/api";

const PAGE_SIZE_OPTIONS = [8, 12, 20, 40];

interface GalleryWithControlsProps {
  photos: Photo[];
  onOpen: (photo: Photo, index: number) => void;
}

export default function GalleryWithControls({ photos, onOpen }: GalleryWithControlsProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[1]);
  const [page, setPage] = useState<number>(1);

  const paginatedPhotos = photos.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(photos.length / pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Плавная прокрутка к началу галереи
    document.querySelector('.gallery-container')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  // Обработчик открытия с правильным индексом
  const handlePhotoOpen = (photo: Photo, paginatedIndex: number) => {
    // Вычисляем реальный индекс в общем массиве
    const realIndex = (page - 1) * pageSize + paginatedIndex;
    onOpen(photo, realIndex);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="space-y-8">
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

      <div className="gallery-container">
        <FileGallery
          photos={paginatedPhotos}
          viewMode={viewMode}
          onOpen={handlePhotoOpen}
        />
      </div>

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          {/* Pagination Info */}
          <div className="glass rounded-2xl px-6 py-3">
            <span className="text-white/70">
              Показано {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, photos.length)} из {photos.length} изображений
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`glass rounded-2xl p-3 transition-all duration-300 group ${
                page === 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'glass-hover hover:scale-105'
              }`}
            >
              <ChevronLeft className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getVisiblePages().map((pageNum, index) => (
                <div key={index}>
                  {pageNum === '...' ? (
                    <span className="px-3 py-2 text-white/40">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(pageNum as number)}
                      className={`min-w-[44px] h-11 rounded-2xl font-medium transition-all duration-300 ${
                        page === pageNum
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                          : 'glass glass-hover text-white/70 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`glass rounded-2xl p-3 transition-all duration-300 group ${
                page === totalPages
                  ? 'opacity-40 cursor-not-allowed'
                  : 'glass-hover hover:scale-105'
              }`}
            >
              <ChevronRight className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" />
            </button>
          </div>

          {/* Quick Jump */}
          {totalPages > 10 && (
            <div className="glass rounded-2xl px-4 py-3 flex items-center space-x-3">
              <span className="text-sm text-white/70">Перейти к странице:</span>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={page}
                  onChange={(e) => {
                    const newPage = Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1));
                    handlePageChange(newPage);
                  }}
                  className="w-20 px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-center outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                />
              </div>
              <span className="text-sm text-white/50">из {totalPages}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}