import ImagesLayout from "@/components/ImagesLayout";
import PhotoViewer from "@/widgets/photo-viewer/PhotoViewer";
import { ReactElement } from "react";

export default function ImageByIdPage() {
  return <PhotoViewer title="hdr" />;
}

ImageByIdPage.getLayout = function getLayout(page: ReactElement) {
  return <ImagesLayout route="hdr">{page}</ImagesLayout>;
};
