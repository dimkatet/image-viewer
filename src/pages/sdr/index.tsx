import { fetchListOfFiles, Photo } from "@/utils/api";
import PhotoGallery from "@/widgets/photo-gallary/PhotoGallery";
import { GetServerSideProps } from "next";

type Props = {
  photos: Photo[];
  success: boolean;
};

const SDRIndex = (props: Props) => <PhotoGallery title="sdr" {...props} />;

export default SDRIndex;

export const getServerSideProps: GetServerSideProps<Props> = async () => ({
  props: await fetchListOfFiles("webp"),
});
