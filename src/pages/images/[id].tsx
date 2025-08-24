import ImagesLayout, { ImagesContext } from "@/components/ImagesLayout";
import ImageModal from "@/widgets/photo-viewer/ImageModal";
import ViewModalSkeleton from "@/widgets/photo-viewer/ViewModalSkeleton";
import { useRouter } from "next/router";
import { ReactElement, useContext } from "react";

export default function ImageByIdPage() {
  const router = useRouter();
  const { id } = router.query;
  const { photos, loading } = useContext(ImagesContext);

  // Вычисляем индекс фото по id
  const currentIndex = photos.findIndex((p) => String(p.id) === String(id));
  const photo = currentIndex >= 0 ? photos[currentIndex] : null;

  // Листание
  const goPrev = () => {
    if (currentIndex > 0) {
      router.push(`/images/${photos[currentIndex - 1].id}`);
    }
  };
  const goNext = () => {
    if (currentIndex < photos.length - 1) {
      router.push(`/images/${photos[currentIndex + 1].id}`);
    }
  };

  if (loading) {
    return <ViewModalSkeleton />;
  }

  if (!photo && id) {
    return (
      <div className="text-center py-12 text-gray-500">Файл не найден</div>
    );
  }

  return (
    <>
      {photo && (
        <ImageModal
          photo={photo}
          onClose={() => router.push("/images")}
          loading={false}
          onPrev={currentIndex > 0 ? goPrev : undefined}
          onNext={currentIndex < photos.length - 1 ? goNext : undefined}
          canPrev={currentIndex > 0}
          canNext={currentIndex < photos.length - 1}
          currentIndex={currentIndex}
          total={photos.length}
        />
      )}
    </>
  );
}

ImageByIdPage.getLayout = function getLayout(page: ReactElement) {
  return <ImagesLayout>{page}</ImagesLayout>;
};
