import { fetchListOfFiles, Photo } from "@/utils/api";
import PhotoGallery from "@/widgets/photo-gallary/PhotoGallery";
import { GetServerSideProps } from "next";

type Props = {
  photos: Photo[];
  success: boolean;
};

const HDRIndex = (props: Props) => {
  return <PhotoGallery title="hdr" {...props} />;
};

export default HDRIndex;

export const getServerSideProps: GetServerSideProps<Props> = async () => ({
  props: await fetchListOfFiles("avif"),
});
