import { useState } from "react";
import ViewControls from "@/widgets/file-gallery/ViewControls";
import FileGallery from "@/widgets/file-gallery/FileGallery";
import { Photo } from "@/utils/storage";

const PAGE_SIZE_OPTIONS = [8, 12, 20, 40];

interface GalleryWithControlsProps {
  photos: Photo[];
  onOpen: (photo: Photo) => void;
}

export default function GalleryWithControls({ photos, onOpen }: GalleryWithControlsProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState<number>(1);

  const paginatedPhotos = photos.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(photos.length / pageSize);

  return (
    <div>
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
        onOpen={onOpen}
      />
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
    </div>
  );
}
