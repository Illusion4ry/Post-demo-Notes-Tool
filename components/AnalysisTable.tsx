import React, { useState } from 'react';
import { AnalysisResult, TABLE_ROWS } from '../types';

interface AnalysisTableProps {
  data: AnalysisResult;
}

const CopyableCell: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div 
      onClick={handleCopy}
      className="group relative cursor-pointer py-4 px-6 transition-colors duration-200 hover:bg-blue-50 h-full"
    >
      <div className="whitespace-pre-wrap leading-relaxed text-gray-800 font-normal">
        {text || <span className="text-gray-400 italic">--</span>}
      </div>
      
      {/* Hover/Copy Feedback */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {copied ? (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 shadow-sm border border-green-200">
            Copied!
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white text-gray-500 shadow-sm border border-gray-200">
            Click to copy
          </span>
        )}
      </div>
    </div>
  );
};

const AnalysisTable: React.FC<AnalysisTableProps> = ({ data }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 backdrop-blur-xl flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Call Summary</h2>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr>
              <th scope="col" className="w-1/3 px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                HubSpot Field
              </th>
              <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {TABLE_ROWS.map((row) => (
              <tr key={row.key} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 align-top select-none">
                  {row.label}
                </td>
                <td className="p-0 align-top text-sm">
                  <CopyableCell text={data[row.key]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalysisTable;