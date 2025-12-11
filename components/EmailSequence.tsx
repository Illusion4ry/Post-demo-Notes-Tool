import React, { useState } from 'react';
import { EmailDraft } from '../types';

interface EmailSequenceProps {
  emails: EmailDraft[];
}

const CopyButton: React.FC<{ text: string, label?: string }> = ({ text, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors flex items-center gap-1"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Copied</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <span>{label || "Copy"}</span>
        </>
      )}
    </button>
  );
};

const EmailSequence: React.FC<EmailSequenceProps> = ({ emails }) => {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Follow-up Sequence</h2>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-200">
          6 Touch Points
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {emails.map((email, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900">Touch Point #{index + 1}</h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {email.recommendedDate}
                </p>
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</label>
                  <CopyButton text={email.subject} />
                </div>
                <div className="text-sm font-medium text-gray-900 bg-gray-50/50 p-2 rounded border border-gray-100">
                  {email.subject}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Body</label>
                  <CopyButton text={email.body} />
                </div>
                <div className="text-sm text-gray-700 bg-gray-50/50 p-3 rounded border border-gray-100 whitespace-pre-wrap leading-relaxed font-normal">
                  {email.body}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailSequence;