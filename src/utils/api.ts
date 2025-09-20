const BASE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;
const USERNAME = process.env.NEXT_PUBLIC_STORAGE_LOGIN;
const PASSWORD = process.env.NEXT_PUBLIC_STORAGE_PASSWORD;
const DIR_NAME = process.env.NEXT_PUBLIC_STORAGE_ROOT_DIR;
const SHARE_ID = process.env.NEXT_PUBLIC_STORAGE_SHARE_ID;

export type FileInfo = {
  path: string;
  name: string;
  size: number;
  extension: string;
  modified: string;
  mode: number;
  isDir: boolean;
  isSymlink: boolean;
  type: string;
};

type FilesResponse = {
  items: FileInfo[];
};

export type Photo = FileInfo & {
  id: string;
  url: string;
};

export const fetchListOfFiles = async (
  path: string
): Promise<{ photos: Photo[]; success: boolean }> => {
  const loginRes = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });

  if (!loginRes.ok) {
    return { photos: [], success: false };
  }
  const token = await loginRes.text();

  const filesRes = await fetch(
    `${BASE_URL}/api/resources/${DIR_NAME}/${path}`,
    { headers: { Cookie: `auth=${token}` } }
  );

  console.log(filesRes);
  if (!filesRes.ok) {
    return { photos: [], success: false };
  }

  const files: FilesResponse = await filesRes.json();
  const filesWithThumbnails = files.items.map((file) => ({
    ...file,
    id: encodeURIComponent(file.name),
    url: `${BASE_URL}/api/public/dl/${SHARE_ID}/${path}/${file.name}`,
  })).sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
  return {
    photos: filesWithThumbnails || [],
    success: true,
  };
};
