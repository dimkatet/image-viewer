import { ReactNode, useEffect, useState, createContext } from "react";
import { createClient } from "@supabase/supabase-js";
import { Photo, transformStorageData } from "@/utils/storage";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const BUCKET_NAME = process.env.NEXT_PUBLIC_BUCKET_NAME!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ImagesLayout({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);
      const { data, error } = await supabase.storage.from(BUCKET_NAME).list("", { limit: 1000 });
      if (!error) {
        setPhotos(transformStorageData(data ?? [], SUPABASE_URL, BUCKET_NAME));
      } else {
        setPhotos([]);
      }
      setLoading(false);
    }
    fetchPhotos();
  }, []);

  return (
    <ImagesContext.Provider value={{ photos, loading }}>
      <div>
        {children}
      </div>
    </ImagesContext.Provider>
  );
}

export const ImagesContext = createContext<{
  photos: Photo[];
  loading: boolean;
}>({ photos: [], loading: true });
