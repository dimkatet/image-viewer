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
  <div className="flex flex-col gap-4 mb-8">
    {/* Top row - View mode and main actions */}
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      {/* Left side - View mode */}
      <div className="flex items-center justify-between sm:justify-start">
        <div className="glass rounded-2xl p-1 flex animate-slide-in">
          <button
            className={`relative px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 min-w-[100px] ${
              viewMode === 'list'
                ? 'bg-blue-500/30 text-blue-300 shadow-lg shadow-blue-500/20'
                : 'text-white/60 hover:text-white/80 hover:bg-white/5'
            }`}
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
            <span className="text-sm">Список</span>
            {viewMode === 'list' && (
              <div className="absolute inset-0 rounded-xl bg-blue-500/20 animate-pulse"></div>
            )}
          </button>
          <button
            className={`relative px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 min-w-[100px] ${
              viewMode === 'grid'
                ? 'bg-blue-500/30 text-blue-300 shadow-lg shadow-blue-500/20'
                : 'text-white/60 hover:text-white/80 hover:bg-white/5'
            }`}
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="text-sm">Сетка</span>
            {viewMode === 'grid' && (
              <div className="absolute inset-0 rounded-xl bg-blue-500/20 animate-pulse"></div>
            )}
          </button>
        </div>

        {/* Mobile-only controls */}
        <div className="flex items-center space-x-2 sm:hidden">
          <button className="glass rounded-2xl p-3 glass-hover group">
            <Filter className="w-4 h-4 text-white/60 group-hover:text-blue-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Right side - Desktop actions */}
      <div className="hidden sm:flex items-center space-x-3">
        <button className="glass rounded-2xl p-3 glass-hover group animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <Filter className="w-4 h-4 text-white/60 group-hover:text-blue-400 transition-colors" />
        </button>

        <div className="glass rounded-2xl px-4 py-3 animate-slide-in flex items-center space-x-3" style={{ animationDelay: '0.3s' }}>
          <span className="text-sm text-white/70 font-medium whitespace-nowrap">На странице:</span>
          <div className="relative">
            <select
              className="bg-transparent outline-none text-white cursor-pointer text-sm font-medium min-w-[50px] pr-6"
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

        <div className="glass rounded-2xl px-4 py-3 animate-slide-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-white/50">Качество:</span>
            <span className="text-xs text-blue-400 font-semibold">HDR</span>
          </div>
        </div>
      </div>
    </div>

    {/* Second row - Search and mobile page size */}
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      {/* Search Bar */}
      <div className="relative group animate-slide-in flex-1 sm:max-w-md" style={{ animationDelay: '0.1s' }}>
        <div className="glass rounded-2xl flex items-center px-4 py-3 group-hover:bg-white/10 transition-all duration-300 h-12">
          <Search className="w-4 h-4 text-white/40 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Поиск изображений..."
            className="bg-transparent outline-none text-white placeholder-white/40 w-full text-sm"
          />
        </div>
      </div>

      {/* Mobile controls row */}
      <div className="flex items-center justify-between sm:hidden gap-3">
        {/* Page Size for Mobile */}
        <div className="glass rounded-2xl px-4 py-3 flex items-center space-x-3 flex-1">
          <span className="text-sm text-white/70 font-medium whitespace-nowrap">На странице:</span>
          <div className="relative">
            <select
              className="bg-transparent outline-none text-white cursor-pointer text-sm font-medium min-w-[50px] pr-6"
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

        {/* HDR Badge for Mobile */}
        <div className="glass rounded-2xl px-4 py-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-white/50">Качество:</span>
            <span className="text-xs text-blue-400 font-semibold">HDR</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ViewControls;