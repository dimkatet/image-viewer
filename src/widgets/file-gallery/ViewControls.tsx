import React from 'react';
import { Grid3X3, List, Search, Filter } from 'lucide-react';

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
  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8">
    {/* Left side - View mode & Search */}
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* View Mode Toggle */}
      <div className="glass rounded-2xl p-1 flex animate-slide-in">
        <button
          className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
            viewMode === 'list'
              ? 'bg-blue-500/30 text-blue-300 shadow-lg shadow-blue-500/20'
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
          }`}
          onClick={() => setViewMode('list')}
        >
          <List className="w-4 h-4" />
          <span className="hidden sm:inline">Список</span>
          {viewMode === 'list' && (
            <div className="absolute inset-0 rounded-xl bg-blue-500/20 animate-pulse"></div>
          )}
        </button>
        <button
          className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
            viewMode === 'grid'
              ? 'bg-blue-500/30 text-blue-300 shadow-lg shadow-blue-500/20'
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
          }`}
          onClick={() => setViewMode('grid')}
        >
          <Grid3X3 className="w-4 h-4" />
          <span className="hidden sm:inline">Сетка</span>
          {viewMode === 'grid' && (
            <div className="absolute inset-0 rounded-xl bg-blue-500/20 animate-pulse"></div>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group animate-slide-in" style={{ animationDelay: '0.1s' }}>
        <div className="glass rounded-2xl flex items-center px-4 py-3 group-hover:bg-white/10 transition-all duration-300">
          <Search className="w-4 h-4 text-white/40 mr-3" />
          <input
            type="text"
            placeholder="Поиск изображений..."
            className="bg-transparent outline-none text-white placeholder-white/40 w-full sm:w-64"
          />
        </div>
      </div>
    </div>

    {/* Right side - Controls */}
    <div className="flex items-center space-x-4">
      {/* Filter Button */}
      <button className="glass rounded-2xl p-3 glass-hover group animate-slide-in" style={{ animationDelay: '0.2s' }}>
        <Filter className="w-4 h-4 text-white/60 group-hover:text-blue-400 transition-colors" />
      </button>

      {/* Page Size Selector */}
      <div className="glass rounded-2xl p-1 animate-slide-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center space-x-3 px-3 py-2">
          <span className="text-sm text-white/70 font-medium">На странице:</span>
          <div className="relative">
            <select
              className="bg-transparent outline-none text-white cursor-pointer text-sm font-medium min-w-[60px] pr-4"
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
            >
              {pageSizeOptions.map(opt => (
                <option key={opt} value={opt} className="bg-gray-800 text-white">
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* View Options */}
      <div className="hidden lg:flex items-center space-x-2 animate-slide-in" style={{ animationDelay: '0.4s' }}>
        <div className="glass rounded-2xl px-4 py-2">
          <span className="text-xs text-white/50">Качество: </span>
          <span className="text-xs text-blue-400 font-semibold">HDR</span>
        </div>
      </div>
    </div>
  </div>
);

export default ViewControls;