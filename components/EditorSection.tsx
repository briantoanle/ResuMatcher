
import React, { useState } from 'react';

interface EditorSectionProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isJson?: boolean;
}

const EditorSection: React.FC<EditorSectionProps> = ({ label, value, onChange, isJson }) => {
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    onChange(newVal);
    
    if (isJson) {
      if (!newVal.trim()) {
        setJsonError(null);
        return;
      }
      try {
        JSON.parse(newVal);
        setJsonError(null);
      } catch (err: any) {
        // More descriptive error handling
        let msg = err.message;
        if (msg.includes('JSON at position')) {
          const pos = msg.match(/position (\d+)/);
          if (pos) msg = `Syntax Error at char ${pos[1]}: ${msg.split('at position')[0].trim()}`;
        }
        setJsonError(msg || 'Invalid JSON format');
      }
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all content?')) {
      onChange(isJson ? '{}' : '');
      setJsonError(null);
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {label && (
        <div className="flex justify-between items-center mb-2 gap-4 flex-shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
              {label}
            </label>
            {isJson && jsonError && (
              <span className="text-[10px] text-red-500 dark:text-red-400 font-bold uppercase tracking-tight truncate bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/30">
                {jsonError}
              </span>
            )}
          </div>
          <button 
            onClick={handleClear}
            className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase tracking-widest transition-colors flex-shrink-0"
          >
            Clear
          </button>
        </div>
      )}
      <div className="flex-grow min-h-0 relative group">
        <textarea
          value={value}
          onChange={handleChange}
          className={`h-full w-full p-4 text-sm font-mono border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none custom-scrollbar ${
            isJson && jsonError 
              ? 'border-red-300 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/50 text-red-900 dark:text-red-200 shadow-inner' 
              : isJson
                ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200'
                : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
          }`}
          placeholder={isJson ? 'Enter Resume JSON...' : 'Paste Job Description here...'}
          spellCheck={false}
          style={{ lineHeight: '1.6' }}
        />
        {isJson && jsonError && (
           <div className="absolute top-2 right-4 pointer-events-none">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
           </div>
        )}
      </div>
    </div>
  );
};

export default EditorSection;
