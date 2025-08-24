import ImagesLayout, { ImagesContext } from "@/components/ImagesLayout";
import { Photo } from "@/utils/storage";
import GalleryWithControls from "@/widgets/file-gallery/GalleryWithControls";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useContext } from "react";
import type { NextPageWithLayout } from "../_app";

const ImagesIndex: NextPageWithLayout = () => {
  const { photos, loading } = useContext(ImagesContext);
  const router = useRouter();

  const openViewer = (photo: Photo) => {
    router.push(`/images/${photo.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">HDR Галерея</h1>
            <span className="text-gray-600 mt-1">
              Найдено {photos.length} изображений
            </span>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <GalleryWithControls photos={photos} onOpen={openViewer} />
      </main>
    </div>
  );
};

ImagesIndex.getLayout = function getLayout(page: ReactElement) {
  return <ImagesLayout>{page}</ImagesLayout>;
};

export default ImagesIndex;
