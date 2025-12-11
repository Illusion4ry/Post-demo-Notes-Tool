import React, { useState } from 'react';
import { analyzeTranscript, generateEmailSequence } from './services/geminiService';
import { AnalysisResult, EmailDraft } from './types';
import AnalysisTable from './components/AnalysisTable';
import EmailSequence from './components/EmailSequence';

const App: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [emails, setEmails] = useState<EmailDraft[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingEmails, setIsGeneratingEmails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError("Please paste a transcript first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setEmails(null); // Reset emails on new analysis

    try {
      const data = await analyzeTranscript(transcript);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze transcript. Please check your API key.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateEmails = async () => {
    if (!transcript.trim()) return;

    setIsGeneratingEmails(true);
    try {
      const data = await generateEmailSequence(transcript);
      setEmails(data.emails);
    } catch (err) {
      console.error("Failed to generate emails", err);
      // Optional: show a specific error for emails, or reuse global error
      alert("Failed to generate emails. Please try again.");
    } finally {
      setIsGeneratingEmails(false);
    }
  };

  const handleClear = () => {
    setTranscript('');
    setResult(null);
    setEmails(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1D1D1F] p-4 md:p-12 font-sans selection:bg-blue-100">
      <div className="max-w-[1200px] mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0b0c0c]">
            Transcript <span className="text-[#0055D4]">Analyzer</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Turn your sales calls into actionable, ready-to-paste HubSpot notes instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Input Section */}
          <div className="flex flex-col h-full space-y-4">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-200 transition-shadow duration-300 hover:shadow-md flex-grow flex flex-col min-h-[500px]">
              <textarea
                className="w-full h-full p-6 rounded-xl bg-transparent border-none outline-none resize-none text-base text-gray-800 placeholder-gray-400 font-mono leading-relaxed"
                placeholder="Paste the transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !transcript.trim()}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white shadow-sm transition-all duration-200 transform
                  ${isLoading || !transcript.trim()
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-[#0055D4] hover:bg-[#0044AA] hover:shadow-md hover:-translate-y-0.5'
                  }`}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Generate Analysis'
                )}
              </button>
              
              <button
                onClick={handleClear}
                disabled={isLoading || !transcript}
                className="px-6 py-4 text-gray-500 font-medium bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-sm"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="min-h-[200px] lg:mt-0">
            {result ? (
              <div className="animate-fade-in-up space-y-6">
                <AnalysisTable data={result} />
                
                {/* Email Generation Prompt */}
                {!emails && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center space-y-4">
                    <div className="text-gray-900 font-semibold">Want to follow up?</div>
                    <p className="text-sm text-gray-500">Generate a 6-touch-point email sequence based on this conversation.</p>
                    <button
                      onClick={handleGenerateEmails}
                      disabled={isGeneratingEmails}
                      className="w-full py-3 rounded-xl border-2 border-[#0055D4] text-[#0055D4] font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isGeneratingEmails ? (
                         <>
                         <svg className="animate-spin h-4 w-4 text-[#0055D4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         <span>Drafting Emails...</span>
                       </>
                      ) : (
                        "Generate Email Sequence"
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Yet</h3>
                <p className="text-center max-w-xs leading-relaxed">
                  Paste your transcript on the left to extract insights.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Email Sequence Result Section - Full Width below main grid */}
        {emails && (
          <div className="animate-fade-in-up pt-4 pb-20">
             <EmailSequence emails={emails} />
          </div>
        )}

      </div>
      
      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-gray-400 font-light">
        <p>&copy; {new Date().getFullYear()} Transcript Analyzer</p>
      </footer>
    </div>
  );
};

export default App;