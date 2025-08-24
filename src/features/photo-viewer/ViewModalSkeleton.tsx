import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ViewModalSkeleton: React.FC = () => (
  <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 select-none animate-fade-in">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.12) 0%, transparent 40%),
          radial-gradient(circle at 60% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 35%),
          radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 45%)
        `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}></div>
    </div>

    {/* UI Controls */}
    <div className="transition-all duration-500 opacity-60">
      {/* Close Button */}
      <button className="absolute top-6 right-6 z-20 glass rounded-2xl p-3 cursor-not-allowed">
        <X className="w-6 h-6 text-white/60" />
      </button>

      {/* Navigation Buttons */}
      <button className="absolute left-6 top-1/2 -translate-y-1/2 z-20 glass rounded-2xl p-4 cursor-not-allowed">
        <ChevronLeft className="w-8 h-8 text-white/60" />
      </button>

      <button className="absolute right-6 top-1/2 -translate-y-1/2 z-20 glass rounded-2xl p-4 cursor-not-allowed">
        <ChevronRight className="w-8 h-8 text-white/60" />
      </button>

      {/* Top Action Bar Skeleton */}
      <div className="absolute top-6 left-6 flex items-center space-x-3 z-20">
        <div className="glass rounded-2xl p-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-white/20 rounded"></div>
            <div className="w-5 h-5 bg-white/20 rounded"></div>
            <div className="w-5 h-5 bg-white/20 rounded"></div>
            <div className="w-5 h-5 bg-white/20 rounded"></div>
          </div>
        </div>
        <div className="glass rounded-2xl p-4 animate-pulse">
          <div className="w-24 h-5 bg-white/20 rounded"></div>
        </div>
      </div>
    </div>

    {/* Loading Spinner */}
    <div className="flex justify-center items-center w-full h-full relative">
      <div className="glass rounded-3xl p-12 animate-scale-in">
        <div className="relative">
          {/* Spinning Ring */}
          <div className="w-16 h-16 border-4 border-white/20 border-t-blue-400 rounded-full animate-spin"></div>
          {/* Inner Glow */}
          <div className="absolute inset-2 border-2 border-white/10 border-t-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className="mt-6 text-white/70 font-medium animate-pulse">Загрузка изображения...</p>
      </div>
    </div>

    {/* Bottom Info Panel Skeleton */}
    <div className="absolute bottom-6 left-6 right-6 z-20 opacity-60">
      <div className="glass rounded-3xl p-6 backdrop-blur-xl animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-8 bg-white/20 rounded-xl w-64 animate-pulse"></div>
            <div className="h-5 bg-white/15 rounded-lg w-96 animate-pulse"></div>
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-white/10 rounded w-16 animate-pulse"></div>
              <div className="w-1 h-1 rounded-full bg-white/30"></div>
              <div className="h-4 bg-white/10 rounded w-20 animate-pulse"></div>
              <div className="w-1 h-1 rounded-full bg-white/30"></div>
              <div className="h-4 bg-white/10 rounded w-12 animate-pulse"></div>
            </div>
          </div>
          
          {/* Progress Skeleton */}
          <div className="flex items-center space-x-2">
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500/50 to-purple-600/50 rounded-full w-1/3 animate-pulse"></div>
            </div>
            <div className="h-4 bg-white/10 rounded w-8 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Floating Animation Elements */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
    </div>

    {/* Keyboard Shortcuts Hint */}
    <div className="absolute bottom-6 right-6 glass rounded-2xl p-3 text-xs text-white/20 animate-pulse">
      Загрузка...
    </div>
  </div>
);

export default ViewModalSkeleton;