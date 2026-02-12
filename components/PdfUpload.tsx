
import React, { useRef, useState } from 'react';

interface PdfUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

const PdfUpload: React.FC<PdfUploadProps> = ({ onUpload, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        onUpload(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  return (
    <div
      className={`relative group border-2 border-dashed rounded-2xl p-6 transition-all duration-300 text-center ${
        dragActive
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />

      <div className="flex flex-col items-center justify-center space-y-3">
        <div className={`p-3 rounded-xl transition-colors ${isLoading ? 'bg-slate-100 dark:bg-slate-800' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">
            {isLoading ? 'Parsing Resume...' : 'Import Master PDF'}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest font-medium">
            Drag & drop or <button onClick={() => fileInputRef.current?.click()} className="text-blue-600 hover:underline font-bold">browse</button>
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest animate-pulse">Gemini is reading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;
