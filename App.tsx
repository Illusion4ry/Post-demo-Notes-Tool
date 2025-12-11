import React, { useState } from 'react';
import { analyzeTranscript, generateEmailSequence } from './services/geminiService';
import { AnalysisResult, EmailDraft, EmailSettings } from './types';
import AnalysisTable from './components/AnalysisTable';
import EmailSequence from './components/EmailSequence';
import EmailSettingsPanel from './components/EmailSettingsPanel';

const DEFAULT_SETTINGS: EmailSettings = {
  tone: 'casual',
  brevity: 'brief',
  directness: 'polite',
  emojis: 'none',
  focus: 'value',
  urgency: 'patient'
};

const App: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [emails, setEmails] = useState<EmailDraft[] | null>(null);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(DEFAULT_SETTINGS);
  
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
      const data = await generateEmailSequence(transcript, emailSettings);
      setEmails(data.emails);
    } catch (err) {
      console.error("Failed to generate emails", err);
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
    setEmailSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1D1D1F] p-4 md:p-12 font-sans selection:bg-blue-100">
      
      {/* Top Header with Reset */}
      <div className="max-w-[1200px] mx-auto flex justify-between items-center mb-10">
        <div className="text-left">
           <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0b0c0c]">
            Transcript <span className="text-[#0055D4]">Analyzer</span>
          </h1>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Analysis
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto space-y-10">
        
        {/* Intro (Only show if no result) */}
        {!result && (
          <div className="text-center space-y-3 mb-8 animate-fade-in-up">
            <h2 className="text-3xl font-semibold tracking-tight">Turn calls into clients</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Paste your sales call transcript below to extract HubSpot data and generate perfect follow-up emails.
            </p>
          </div>
        )}

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

            {!result && (
              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !transcript.trim()}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white shadow-sm transition-all duration-200 transform
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
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="min-h-[200px] lg:mt-0">
            {result ? (
              <div className="animate-fade-in-up space-y-6">
                <AnalysisTable data={result} />
                
                {/* Email Generation Prompt (Only if no emails yet) */}
                {!emails && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center space-y-4">
                    <div className="text-gray-900 font-semibold">Ready to close the deal?</div>
                    <p className="text-sm text-gray-500">Generate a 6-touch "Exactly What to Say" sequence.</p>
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
                         <span>Drafting Magic Words...</span>
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
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Follow-up Sequence</h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-200">
                Phil M. Jones Method
              </span>
            </div>
            
            <EmailSettingsPanel 
              settings={emailSettings} 
              onUpdate={setEmailSettings} 
              onRegenerate={handleGenerateEmails}
              isGenerating={isGeneratingEmails}
            />
            
            <EmailSequence emails={emails} />
          </div>
        )}

      </div>
      
      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-gray-400 font-light border-t border-gray-200 pt-8">
        <p>&copy; {new Date().getFullYear()} Transcript Analyzer</p>
      </footer>
    </div>
  );
};

export default App;