import { useRouter } from "next/router";

// Заглушка для списка изображений
export default function ImagesIndex() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Выберите галерею</h1>
      <div className="flex gap-6">
        <button
          onClick={() => router.push('/hdr')}
          className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold shadow transition-colors"
        >
          HDR Галерея
        </button>
        <button
          onClick={() => router.push('/sdr')}
          className="px-8 py-4 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xl font-semibold shadow transition-colors"
        >
          SDR Галерея
        </button>
      </div>
    </div>
  );
}
