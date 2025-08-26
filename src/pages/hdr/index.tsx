import ImagesLayout from "@/components/ImagesLayout";
import PhotoGallery from "@/widgets/photo-gallary/PhotoGallery";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";

const HDRIndex: NextPageWithLayout = () => <PhotoGallery title="hdr" />;

HDRIndex.getLayout = function getLayout(page: ReactElement) {
  return <ImagesLayout route="hdr">{page}</ImagesLayout>;
};

export default HDRIndex;