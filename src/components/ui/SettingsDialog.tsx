import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X } from 'lucide-react';
import { Button } from './button';
import { motion, AnimatePresence } from 'motion/react';

export const SettingsDialog: React.FC = () => {
  const { isSettingsOpen, toggleSettings, geminiApiKey, setGeminiApiKey, clearGeminiApiKey } = useAppStore();
  const [draftApiKey, setDraftApiKey] = useState(geminiApiKey);

  useEffect(() => {
    if (isSettingsOpen) {
      setDraftApiKey(geminiApiKey);
    }
  }, [isSettingsOpen, geminiApiKey]);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    setGeminiApiKey(draftApiKey);
    toggleSettings();
  };

  const handleClear = () => {
    clearGeminiApiKey();
    setDraftApiKey('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Settings</h2>
            <Button variant="ghost" size="icon" onClick={toggleSettings} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">API Key</label>
              <div className="text-xs text-muted-foreground mb-2">
                Bring your own Gemini key. It is stored only in this browser.
              </div>
              <input 
                type="password" 
                value={draftApiKey}
                onChange={(e) => setDraftApiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              {geminiApiKey ? (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Saved key is active for this browser.</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-destructive hover:underline"
                  >
                    Clear saved key
                  </button>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  No key saved yet.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Default Speaker Name</label>
              <input 
                type="text" 
                defaultValue="*PAR" 
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Auto-save Interval</label>
              <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                <option>1 minute</option>
                <option>5 minutes</option>
                <option>10 minutes</option>
                <option>Never</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-2">
            <Button variant="outline" onClick={toggleSettings}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
