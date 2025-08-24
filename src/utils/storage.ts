// Функции для работы с Supabase Storage

export interface Photo {
  id: string;
  name: string;
  thumbnail: string;
  full: string;
  title: string;
  description: string;
  created_at: string;
  size: number;
  mimetype: string;
}

interface StorageItem {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>
}

export const getImageUrl = (
  bucketUrl: string,
  bucketName: string,
  fileName: string,
  folder: string
) => `${bucketUrl}/storage/v1/object/public/${bucketName}/${folder}/${fileName}`;

export const getThumbnailUrl = (
  bucketUrl: string,
  bucketName: string,
  fileName: string,
  folder: string
) => `${bucketUrl}/storage/v1/object/public/${bucketName}/thumbnails/${folder}/${fileName}`;

export const transformStorageData = (
  storageItems: StorageItem[],
  bucketUrl: string,
  bucketName: string,
  folder: string
): Photo[] => {
  return storageItems
    .filter((item: StorageItem) =>
      (item.metadata?.mimetype as string)?.startsWith("image/")
    )
    .map((item: StorageItem) => ({
      id: item.id,
      name: item.name,
      thumbnail: getThumbnailUrl(bucketUrl, bucketName, item.name, folder),
      full: getImageUrl(bucketUrl, bucketName, item.name, folder),
      title: item.name.split(".")[0],
      description: `Размер: ${(item.metadata.size as number / 1024 / 1024).toFixed(
        2
      )} МБ, Тип: ${item.metadata.mimetype}`,
      created_at: item.created_at,
      size: item.metadata.size as number,
      mimetype: item.metadata.mimetype as string,
    }))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .reverse();
};
