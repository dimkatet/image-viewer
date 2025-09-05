import ImageModal from "@/features/photo-viewer/ImageModal";
import { Photo } from "@/utils/api";
import { useRouter } from "next/router";

interface Props {
  title: "sdr" | "hdr";
  photos: Photo[];
}

export default function PhotoViewer({ title, photos }: Props) {
  const router = useRouter();
  const { id } = router.query;

  // Вычисляем индекс фото по id
  const currentIndex = photos.findIndex((p) => String(p.id) === String(id));
  const photo = currentIndex >= 0 ? photos[currentIndex] : null;

  // Листание
  const goPrev = () => {
    if (currentIndex > 0) {
      router.push(`/${title}/${photos[currentIndex - 1].id}`);
    }
  };
  const goNext = () => {
    if (currentIndex < photos.length - 1) {
      router.push(`/${title}/${photos[currentIndex + 1].id}`);
    }
  };

  // if (loading) {
  //   return <ViewModalSkeleton />;
  // }

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
          onClose={() => router.push(`/${title}`)}
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
