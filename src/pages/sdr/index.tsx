import ImagesLayout from "@/components/ImagesLayout";
import PhotoGallery from "@/widgets/photo-gallary/PhotoGallery";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";

const ImagesIndex: NextPageWithLayout = () => <PhotoGallery title="sdr" />;

ImagesIndex.getLayout = function getLayout(page: ReactElement) {
  return <ImagesLayout route="sdr">{page}</ImagesLayout>;
};

export default ImagesIndex;
