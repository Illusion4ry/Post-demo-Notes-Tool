import React from 'react';
import { EmailSettings } from '../types';

interface EmailSettingsPanelProps {
  settings: EmailSettings;
  onUpdate: (newSettings: EmailSettings) => void;
}

const EmailSettingsPanel: React.FC<EmailSettingsPanelProps> = ({ 
  settings, 
  onUpdate
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToggleGroup 
          label="Tone" 
          propKey="tone" 
          leftVal="casual" 
          rightVal="formal" 
          leftLabel="Casual" 
          rightLabel="Formal" 
        />
        <ToggleGroup 
          label="Brevity" 
          propKey="brevity" 
          leftVal="brief" 
          rightVal="standard" 
          leftLabel="Ultra Short" 
          rightLabel="Standard" 
        />
        <ToggleGroup 
          label="Directness" 
          propKey="directness" 
          leftVal="polite" 
          rightVal="direct" 
          leftLabel="Polite" 
          rightLabel="Direct" 
        />
        <ToggleGroup 
          label="Focus" 
          propKey="focus" 
          leftVal="value" 
          rightVal="relationship" 
          leftLabel="Value" 
          rightLabel="Relationship" 
        />
        <ToggleGroup 
          label="Urgency" 
          propKey="urgency" 
          leftVal="patient" 
          rightVal="urgent" 
          leftLabel="Patient" 
          rightLabel="Urgent" 
        />
      </div>
    </div>
  );
};

export default EmailSettingsPanel;