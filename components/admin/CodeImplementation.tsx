'use client';

import { useState } from 'react';

interface CodeImplementationProps {
  agent: string;
  originalCode?: string;
  newCode: string;
  filePath: string;
  changes: Array<{
    line: number;
    type: 'add' | 'remove' | 'modify';
    content: string;
  }>;
}

export function CodeImplementation({ 
  agent, 
  originalCode, 
  newCode, 
  filePath,
  changes 
}: CodeImplementationProps) {
  const [showDiff, setShowDiff] = useState(true);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(newCode);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };
  
  return (
    <div className="border border-luxury-black p-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bodoni text-xl">
          {agent} suggests changes to: {filePath}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowDiff(!showDiff)}
            className="px-4 py-2 border border-luxury-black text-sm hover:bg-luxury-black hover:text-white transition-colors"
          >
            {showDiff ? 'Show Full' : 'Show Diff'}
          </button>
        </div>
      </div>
      
      {showDiff ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {changes.map((change, i) => (
            <div 
              key={i}
              className={`p-2 font-mono text-sm ${
                change.type === 'add' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
                change.type === 'remove' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' :
                'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500'
              }`}
            >
              <span className="text-gray-500 mr-2">Line {change.line}:</span>
              <span>{change.type === 'remove' && '- '}</span>
              <span>{change.type === 'add' && '+ '}</span>
              {change.content}
            </div>
          ))}
        </div>
      ) : (
        <pre className="bg-gray-100 p-4 overflow-x-auto max-h-96">
          <code className="text-sm">{newCode}</code>
        </pre>
      )}
      
      <div className="flex gap-4 mt-6">
        <button 
          onClick={copyToClipboard}
          className="px-6 py-2 bg-luxury-black text-white hover:bg-gray-800 transition-colors"
        >
          Copy Full Implementation
        </button>
        <button className="px-6 py-2 border border-luxury-black hover:bg-luxury-black hover:text-white transition-colors">
          Create Pull Request
        </button>
        <button className="px-6 py-2 bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors">
          Apply Changes Directly
        </button>
      </div>
    </div>
  );
} 