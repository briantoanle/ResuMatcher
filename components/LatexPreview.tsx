
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import VisualPreview from './VisualPreview';
import { MasterResume, Experience, Project, Skills } from '../types';

interface LatexPreviewProps {
  latex: string;
  isLoading: boolean;
  masterData: MasterResume;
  optimizedData?: {
    experience: Experience[];
    projects: Project[];
    skills: Skills;
  };
}

const LatexPreview: React.FC<LatexPreviewProps> = ({ latex, isLoading, masterData, optimizedData }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [zoom, setZoom] = useState(0.85);
  const [isAutoFit, setIsAutoFit] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Monitor container size for auto-fit
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate Auto-Fit Scale
  useLayoutEffect(() => {
    if (isAutoFit && containerSize.width > 0 && containerSize.height > 0) {
      const padding = 32; 
      const targetWidth = containerSize.width - padding;
      const targetHeight = containerSize.height - padding;
      
      const pageWidthPx = 8.5 * 96; 
      const pageHeightPx = 11 * 96;
      
      const horizontalScale = targetWidth / pageWidthPx;
      const verticalScale = targetHeight / pageHeightPx;
      
      const newScale = Math.min(horizontalScale, verticalScale);
      setZoom(Math.max(0.2, Math.min(newScale, 1.5))); 
    }
  }, [containerSize, isAutoFit]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTex = () => {
    const element = document.createElement("a");
    const file = new Blob([latex], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "resume.tex";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  /**
   * More robust print logic. 
   * Ensures the preview is active and scaled correctly before calling print.
   */
  const handlePrint = () => {
    setIsPrinting(true);
    setActiveTab('preview');
    
    // Using a slightly longer delay to ensure React finishes re-rendering
    // and the browser layout engine settles before the print dialog opens.
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest animate-pulse text-center">
          Building Preview...
        </p>
      </div>
    );
  }

  if (!latex) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 dark:text-slate-600 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/30">
        <div className="text-center p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium">Click "Build" to see the optimized result.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Dynamic Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 gap-3 no-print">
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl shadow-inner">
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all flex items-center gap-2 ${activeTab === 'preview' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md' : 'text-slate-500'}`}
            >
              PREVIEW
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all flex items-center gap-2 ${activeTab === 'code' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md' : 'text-slate-500'}`}
            >
              SOURCE
            </button>
          </div>

          {activeTab === 'preview' && (
            <div className="hidden sm:flex items-center gap-3 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <button 
                onClick={() => setIsAutoFit(!isAutoFit)}
                title="Toggle Auto-Fit"
                className={`p-1 px-2 rounded-md text-[9px] font-black uppercase transition-all ${isAutoFit ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}
              >
                Fit
              </button>
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="0.2" 
                  max="1.5" 
                  step="0.01" 
                  value={zoom} 
                  onChange={(e) => {
                    setZoom(parseFloat(e.target.value));
                    setIsAutoFit(false);
                  }}
                  className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-[10px] font-mono font-bold text-slate-500 w-8">{Math.round(zoom * 100)}%</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {activeTab === 'code' ? (
            <>
               <button
                onClick={copyToClipboard}
                className="flex-1 sm:flex-none px-5 py-2 text-[10px] font-black text-white bg-slate-800 dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 rounded-xl transition-all uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownloadTex}
                className="flex-1 sm:flex-none px-5 py-2 text-[10px] font-black text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all uppercase tracking-widest shadow-md flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
              >
                Download .tex
              </button>
            </>
          ) : (
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className={`flex-1 sm:flex-none px-6 py-2.5 text-[10px] font-black text-white rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 ${isPrinting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isPrinting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Preparing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 2l4.5 4.5H11V4z" clipRule="evenodd" />
                  </svg>
                  Generate PDF
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Preview Component with Smooth Auto-Centering */}
      <div 
        ref={containerRef}
        className="flex-grow overflow-auto custom-scrollbar bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 relative shadow-inner group"
      >
        {activeTab === 'preview' ? (
          <div className="min-h-full min-w-full flex items-center justify-center p-4 sm:p-8">
             <div className="m-auto">
               <VisualPreview 
                  data={masterData}
                  experience={optimizedData?.experience || masterData.experience}
                  projects={optimizedData?.projects || masterData.projects}
                  skills={optimizedData?.skills || masterData.skills}
                  scale={zoom}
               />
             </div>
          </div>
        ) : (
          <div className="bg-slate-950 p-6 sm:p-8 min-h-full">
            <pre className="text-[11px] sm:text-xs font-mono text-blue-300/90 leading-relaxed whitespace-pre-wrap latex-font selection:bg-blue-500/30">
              {latex}
            </pre>
          </div>
        )}
        
        {/* Floating Mobile Zoom Controls */}
        {activeTab === 'preview' && (
          <div className="sm:hidden absolute bottom-4 right-4 flex flex-col gap-2 z-10 no-print">
            <button 
              onClick={() => { setZoom(z => Math.min(z + 0.1, 1.5)); setIsAutoFit(false); }}
              className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-xl flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-90 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={() => { setZoom(z => Math.max(z - 0.1, 0.2)); setIsAutoFit(false); }}
              className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-xl flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-90 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={() => setIsAutoFit(true)}
              className="w-10 h-10 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatexPreview;
