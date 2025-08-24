import React from 'react';
import { X, ChevronLeft, ChevronRight, Loader } from 'lucide-react';


const ViewModalSkeleton: React.FC = () => (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 select-none">
    {/* UI Controls */}
    <div className="transition-opacity duration-300 opacity-100">
      <button
        className="absolute top-4 right-4 text-white z-10 rounded-full p-2 bg-black/40 hover:bg-red-600 hover:scale-110 transition-all shadow-lg"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
      >
        <X className="w-8 h-8" />
      </button>
      {(
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10 rounded-full p-2 bg-black/40 hover:bg-blue-600 hover:scale-110 transition-all shadow-lg"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
        >
          <ChevronLeft className="w-12 h-12" />
        </button>
      )}
      {(
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white z-10 rounded-full p-2 bg-black/40 hover:bg-blue-600 hover:scale-110 transition-all shadow-lg"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
        >
          <ChevronRight className="w-12 h-12" />
        </button>
      )}
    </div>
    {/* Spinner */}
    <div className="flex justify-center items-center w-full h-full grow-1 relative">
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <Loader className="w-8 h-8 animate-spin text-white" />
      </div>
    </div>
    {/* Info (blurred) */}
    <div className="absolute bottom-4 left-4 right-4 text-white text-center transition-opacity duration-300 opacity-100 pointer-events-none">
      <div className="backdrop-blur-sm bg-black/30 rounded-lg inline-block px-6 py-4">
        <div className="h-6 w-40 bg-gray-700/60 rounded mb-2 blur-sm" />
        <div className="h-4 w-64 bg-gray-700/40 rounded blur-sm" />
      </div>
    </div>
  </div>
);

export default ViewModalSkeleton;
