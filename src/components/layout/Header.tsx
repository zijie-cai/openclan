import React, { useEffect, useState, useRef } from 'react';
import { Activity, Beaker, Settings, Moon, Sun, Upload, FileAudio, Terminal } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/button';
import { Logo } from '../ui/Logo';

export const Header: React.FC = () => {
  const { toggleAnalyticsMode, isAnalyticsMode, aiEnabled, toggleAi, processAudioFile, isProcessingAudio, processingProgress, toggleConsole, toggleSettings } = useAppStore();
  const [isDark, setIsDark] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('audio/') || file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.wav') || file.name.endsWith('.mp3')) {
      await processAudioFile(file);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-0.5">
        <div className="mt-[9px]">
          <Logo />
        </div>
        <span className="font-mono text-lg font-bold tracking-tight text-foreground">
          OpenCLAN
        </span>
      </div>

      <div className="flex items-center gap-4">
        {isProcessingAudio && (
          <div className="flex items-center gap-2 text-xs font-mono text-primary">
            <Activity className="h-3 w-3 animate-pulse" />
            <span>ASR & Diarization: {processingProgress}%</span>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-md bg-secondary p-1">
          <Button
            variant={!isAnalyticsMode ? 'default' : 'ghost'}
            size="sm"
            onClick={() => isAnalyticsMode && toggleAnalyticsMode()}
            className="h-7 px-3 text-xs"
          >
            IDE
          </Button>
          <Button
            variant={isAnalyticsMode ? 'default' : 'ghost'}
            size="sm"
            onClick={() => !isAnalyticsMode && toggleAnalyticsMode()}
            className="h-7 px-3 text-xs"
          >
            Analytics
          </Button>
        </div>

        <div className="h-4 w-px bg-border" />

        <input type="file" accept="audio/*,video/*,.mp4,.wav,.mp3" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 gap-2"
          disabled={isProcessingAudio}
        >
          <FileAudio className="h-4 w-4" />
          Upload Media
        </Button>

        <Button
          variant={aiEnabled ? 'default' : 'outline'}
          size="sm"
          onClick={toggleAi}
          className="h-8 gap-2"
        >
          <Beaker className="h-4 w-4" />
          AI Copilot {aiEnabled ? 'On' : 'Off'}
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleConsole}>
          <Terminal className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDark(!isDark)}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSettings}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};


