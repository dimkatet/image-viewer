import React from "react";
import { Photo } from "@/utils/storage";

interface FileGalleryProps {
  photos: Photo[];
  viewMode: "list" | "grid";
  onOpen: (photo: Photo, idx: number) => void;
}

const FileGallery: React.FC<FileGalleryProps> = ({
  photos,
  viewMode,
  onOpen,
}) => {
  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-gray-500">Нет изображений</span>
      </div>
    );
  }
  if (viewMode === "list") {
    return (
      <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
        {photos.map((photo, idx) => (
          <li
            key={photo.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-gray-700">{photo.name}</span>
              <span className="text-xs text-gray-400">
                {photo.size ? (photo.size / 1024 / 1024).toFixed(2) : "--"} МБ
              </span>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
              onClick={() => onOpen(photo, idx)}
            >
              Смотреть
            </button>
          </li>
        ))}
      </ul>
    );
  }
  // grid
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {photos.map((photo, idx) => (
        <div
          key={photo.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden flex flex-col"
          onClick={() => onOpen(photo, idx)}
        >
          <div className="aspect-w-4 aspect-h-3 relative w-full">
            <img
              src={photo.thumbnail}
              alt={photo.title}
              className="w-full h-40 object-cover hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          </div>
          <div className="p-3 flex-1 flex flex-col justify-between">
            <h3 className="font-semibold text-gray-900 mb-1 truncate">
              {photo.title}
            </h3>
            <p className="text-xs text-gray-600 truncate">
              {photo.description}
            </p>
            <span className="text-xs text-gray-400 mt-1">
              {photo.size ? (photo.size / 1024 / 1024).toFixed(2) : "--"} МБ
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGallery;
