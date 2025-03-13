// src/components/UI/Modals/SettingsModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  fastMode: boolean;
  autoSpin: boolean;
  showWinAnimations: boolean;
  darkMode: boolean; // For future implementation
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  // Default settings
  const defaultSettings: GameSettings = {
    soundEnabled: true,
    musicEnabled: true,
    fastMode: false,
    autoSpin: false,
    showWinAnimations: true,
    darkMode: true,
  };
  
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  
  // Load settings from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedSettings = localStorage.getItem('tngmiSlotSettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(prevSettings => ({
            ...prevSettings,
            ...parsedSettings,
          }));
        } catch (error) {
          console.error('Failed to parse saved settings:', error);
        }
      }
    }
  }, [isOpen]);
  
  // Toggle a setting
  const toggleSetting = (key: keyof GameSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: !prevSettings[key],
    }));
  };
  
  // Save settings
  const saveSettings = () => {
    try {
      localStorage.setItem('tngmiSlotSettings', JSON.stringify(settings));
      // Here you could also trigger any immediate effects of the settings
      // (e.g., turning sound on/off)
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };
  
  // Reset to defaults
  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Game Settings"
      size="medium"
    >
      <div className="space-y-6">
        <div className="settings-list space-y-4">
          {/* Sound Effects */}
          <div className="setting-item flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium">Sound Effects</h3>
              <p className="text-gray-400 text-sm">Play sounds for wins and spins</p>
            </div>
            <div className="toggle-switch">
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                onClick={() => toggleSetting('soundEnabled')}
                aria-pressed={settings.soundEnabled}
                aria-label="Toggle sound effects"
              >
                <span 
                  className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>
          </div>
          
          {/* Background Music */}
          <div className="setting-item flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium">Background Music</h3>
              <p className="text-gray-400 text-sm">Play music during gameplay</p>
            </div>
            <div className="toggle-switch">
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.musicEnabled ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                onClick={() => toggleSetting('musicEnabled')}
                aria-pressed={settings.musicEnabled}
                aria-label="Toggle background music"
              >
                <span 
                  className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                    settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>
          </div>
          
          {/* Fast Mode */}
          <div className="setting-item flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium">Fast Mode</h3>
              <p className="text-gray-400 text-sm">Speed up reel animations</p>
            </div>
            <div className="toggle-switch">
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.fastMode ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                onClick={() => toggleSetting('fastMode')}
                aria-pressed={settings.fastMode}
                aria-label="Toggle fast mode"
              >
                <span 
                  className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                    settings.fastMode ? 'translate-x-6' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>
          </div>
          
          {/* Auto Spin */}
          <div className="setting-item flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium">Auto Spin</h3>
              <p className="text-gray-400 text-sm">Automatically spin after wins</p>
            </div>
            <div className="toggle-switch">
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.autoSpin ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                onClick={() => toggleSetting('autoSpin')}
                aria-pressed={settings.autoSpin}
                aria-label="Toggle auto spin"
              >
                <span 
                  className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                    settings.autoSpin ? 'translate-x-6' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>
          </div>
          
          {/* Win Animations */}
          <div className="setting-item flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium">Win Animations</h3>
              <p className="text-gray-400 text-sm">Show animations for wins</p>
            </div>
            <div className="toggle-switch">
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.showWinAnimations ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                onClick={() => toggleSetting('showWinAnimations')}
                aria-pressed={settings.showWinAnimations}
                aria-label="Toggle win animations"
              >
                <span 
                  className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                    settings.showWinAnimations ? 'translate-x-6' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>
          </div>
        </div>
        
        <div className="divider border-t border-gray-700 my-4"></div>
        
        {/* Action Buttons */}
        <div className="flex justify-between gap-3">
          <Button
            onClick={resetToDefaults}
            variant="outline"
            className="flex-1"
          >
            Reset to Defaults
          </Button>
          <Button
            onClick={saveSettings}
            variant="primary"
            className="flex-1"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;