import React from 'react';

interface ViewControlsProps {
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  pageSizeOptions: number[];
}

const ViewControls: React.FC<ViewControlsProps> = ({
  viewMode,
  setViewMode,
  pageSize,
  setPageSize,
  pageSizeOptions,
}) => (
  <div className="flex flex-wrap gap-4 items-center mb-6">
    <div className="flex gap-2 items-center">
      <span className="text-gray-700">Вид:</span>
      <button
        className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        onClick={() => setViewMode('list')}
      >
        Список
      </button>
      <button
        className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        onClick={() => setViewMode('grid')}
      >
        Таблица
      </button>
    </div>
    <div className="flex gap-2 items-center">
      <span className="text-gray-700">На странице:</span>
      <select
        className="border rounded px-2 py-1 text-gray-700"
        value={pageSize}
        onChange={e => setPageSize(Number(e.target.value))}
      >
        {pageSizeOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  </div>
);

export default ViewControls;
