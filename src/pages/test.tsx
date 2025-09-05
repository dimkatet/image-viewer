import { fetchListOfFiles, Photo } from "@/utils/api";
import Image from 'next/image'
import { GetServerSideProps } from "next";


type Props = {
  photos: Photo[];
};

export default function FilesPage({ photos }: Props) {
  console.log(photos);
  return (
    <div>
      <h1>Список файлов</h1>
      <ul>
        {photos.map((f) => (
          <Image
            key={f.path}
            src={f.thumbnailUrl}
            alt={f.name}
            width={200}
            height={200}
          />
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => ({
  props: await fetchListOfFiles("avif"),
});
