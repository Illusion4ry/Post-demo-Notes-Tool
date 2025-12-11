import React from 'react';
import { EmailSettings } from '../types';

interface EmailSettingsPanelProps {
  settings: EmailSettings;
  onUpdate: (newSettings: EmailSettings) => void;
  onRegenerate: () => void;
  isGenerating: boolean;
}

const EmailSettingsPanel: React.FC<EmailSettingsPanelProps> = ({ 
  settings, 
  onUpdate, 
  onRegenerate,
  isGenerating 
}) => {
  
  const handleToggle = (key: keyof EmailSettings, value: string) => {
    onUpdate({ ...settings, [key]: value });
  };

  const ToggleGroup = ({ label, propKey, leftVal, rightVal, leftLabel, rightLabel }: any) => (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
        <button
          onClick={() => handleToggle(propKey, leftVal)}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
            settings[propKey as keyof EmailSettings] === leftVal
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {leftLabel}
        </button>
        <button
          onClick={() => handleToggle(propKey, rightVal)}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
            settings[propKey as keyof EmailSettings] === rightVal
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {rightLabel}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sequence Configuration</h3>
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            isGenerating 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate Emails
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToggleGroup 
          label="Tone" 
          propKey="tone" 
          leftVal="casual" 
          rightVal="formal" 
          leftLabel="😌 Casual" 
          rightLabel="👔 Formal" 
        />
        <ToggleGroup 
          label="Brevity" 
          propKey="brevity" 
          leftVal="brief" 
          rightVal="standard" 
          leftLabel="⚡ Ultra Short" 
          rightLabel="📝 Standard" 
        />
        <ToggleGroup 
          label="Directness" 
          propKey="directness" 
          leftVal="polite" 
          rightVal="direct" 
          leftLabel="🤝 Polite" 
          rightLabel="🎯 Direct" 
        />
        <ToggleGroup 
          label="Focus" 
          propKey="focus" 
          leftVal="value" 
          rightVal="relationship" 
          leftLabel="💡 Value" 
          rightLabel="❤️ Relation" 
        />
        <ToggleGroup 
          label="Urgency" 
          propKey="urgency" 
          leftVal="patient" 
          rightVal="urgent" 
          leftLabel="🐢 Patient" 
          rightLabel="🔥 Urgent" 
        />
        <ToggleGroup 
          label="Emojis" 
          propKey="emojis" 
          leftVal="none" 
          rightVal="minimal" 
          leftLabel="🚫 None" 
          rightLabel="✨ Minimal" 
        />
      </div>
    </div>
  );
};

export default EmailSettingsPanel;