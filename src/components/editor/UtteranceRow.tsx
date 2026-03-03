import React, { useState, useEffect } from 'react';
import { Utterance } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../ui/button';
import { PlayCircle, AlertTriangle, Sparkles, Clock, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';

interface UtteranceRowProps {
  utterance: Utterance;
  sessionId: string;
  isPlaying?: boolean;
}

export const UtteranceRow: React.FC<UtteranceRowProps> = ({ utterance, sessionId, isPlaying }) => {
  const { activeUtteranceId, selectUtterance, updateUtterance, updateUtteranceTimestamp, removeUtterance, aiEnabled, addTier, updateTier } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(utterance.text);
  const [speaker, setSpeaker] = useState(utterance.speaker);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    setText(utterance.text);
    setSpeaker(utterance.speaker);
  }, [utterance.text, utterance.speaker]);

  const isActive = activeUtteranceId === utterance.id;

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== utterance.text || speaker !== utterance.speaker) {
      updateUtterance(sessionId, utterance.id, text, speaker);
    }
  };

  const hasErrors = utterance.metrics?.errors && utterance.metrics.errors.length > 0;
  const hasAiSuggestions = aiEnabled && utterance.aiSuggestions && utterance.aiSuggestions.length > 0;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const parseTimeStr = (str: string): number => {
    const parts = str.split(':');
    if (parts.length === 2) {
      const min = parseInt(parts[0], 10) || 0;
      const secParts = parts[1].split('.');
      const sec = parseInt(secParts[0], 10) || 0;
      const ms = secParts[1] ? parseInt(secParts[1].padEnd(3, '0').substring(0, 3), 10) : 0;
      return (min * 60 + sec) * 1000 + ms;
    }
    return 0;
  };

  const handleTimeBlur = () => {
    setIsEditingTime(false);
    if (!timeStr) {
      updateUtteranceTimestamp(sessionId, utterance.id, undefined);
      return;
    }
    
    const parts = timeStr.split('-');
    if (parts.length === 2) {
      const start = parseTimeStr(parts[0].trim());
      const end = parseTimeStr(parts[1].trim());
      updateUtteranceTimestamp(sessionId, utterance.id, [start, end]);
    } else if (parts.length === 1) {
      const start = parseTimeStr(parts[0].trim());
      updateUtteranceTimestamp(sessionId, utterance.id, [start, start + 1000]);
    }
  };

  const startEditingTime = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (utterance.timestamp) {
      setTimeStr(`${formatTime(utterance.timestamp[0])} - ${formatTime(utterance.timestamp[1])}`);
    } else {
      setTimeStr('');
    }
    setIsEditingTime(true);
  };

  const getConfidenceColor = (conf?: number) => {
    if (conf === undefined) return 'border-transparent';
    if (conf > 0.9) return 'border-primary/50';
    if (conf > 0.7) return 'border-yellow-500/50';
    return 'border-destructive/50';
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (utterance.timestamp) {
      const mediaEl = document.querySelector('audio, video') as HTMLMediaElement;
      if (mediaEl) {
        mediaEl.currentTime = utterance.timestamp[0] / 1000;
        mediaEl.play();
      }
    }
  };

  return (
    <motion.div
      id={`utterance-${utterance.id}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group relative flex cursor-pointer rounded-md border-l-4 p-2 transition-all hover:bg-accent/50',
        getConfidenceColor(utterance.confidence),
        isActive ? 'bg-accent/80 shadow-sm border-y border-r border-y-border border-r-border' : 'border-y border-r border-transparent',
        isPlaying ? 'bg-cyan-500/10 shadow-[inset_4px_0_0_0_rgba(6,182,212,1)]' : ''
      )}
      onClick={() => selectUtterance(utterance.id)}
    >
      <div className="flex w-20 shrink-0 flex-col items-start gap-1 pt-1 font-mono text-xs font-semibold text-muted-foreground">
        <div className="flex items-center gap-1">
          <button 
            className="opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
            onClick={handlePlay}
          >
            <PlayCircle className="h-3.5 w-3.5" />
          </button>
          {isEditing ? (
            <input
              type="text"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              className="w-12 bg-transparent font-mono text-xs text-foreground outline-none focus:ring-1 focus:ring-primary rounded px-1"
            />
          ) : (
            <span 
              className={cn(utterance.speaker === '*PAR' ? 'text-primary' : 'text-blue-400')}
              onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            >
              {utterance.speaker}
            </span>
          )}
        </div>
        {isEditingTime ? (
          <input
            autoFocus
            type="text"
            value={timeStr}
            onChange={(e) => setTimeStr(e.target.value)}
            onBlur={handleTimeBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleTimeBlur()}
            placeholder="00:00 - 00:00"
            className="w-full bg-transparent font-mono text-[10px] text-foreground outline-none focus:ring-1 focus:ring-primary rounded px-1 mt-1"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div 
            className="flex items-center gap-1 text-[10px] text-muted-foreground/70 pl-4 cursor-text hover:text-foreground transition-colors"
            onDoubleClick={startEditingTime}
          >
            <Clock className="h-3 w-3" />
            {utterance.timestamp ? formatTime(utterance.timestamp[0]) : 'Add time'}
          </div>
        )}
      </div>

      <div className="flex-1 pl-2">
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            className="w-full bg-transparent font-mono text-sm text-foreground outline-none focus:ring-1 focus:ring-primary rounded px-1"
          />
        ) : (
          <div
            className="font-mono text-sm text-foreground"
            onDoubleClick={() => setIsEditing(true)}
          >
            {utterance.text}
          </div>
        )}

        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            {utterance.dependentTiers.map((tier, i) => (
              <div key={i} className="mt-1 flex gap-2 font-mono text-xs text-muted-foreground items-center">
                <span className="w-10 shrink-0 text-right">{tier.type}</span>
                <input
                  value={tier.text}
                  onChange={(e) => updateTier(sessionId, utterance.id, i, e.target.value)}
                  className="flex-1 bg-background border border-border outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1 text-foreground"
                />
              </div>
            ))}
            <div className="mt-2 flex gap-2 pl-12 items-center">
              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); addTier(sessionId, utterance.id, '%mor:'); }} className="h-6 text-[10px] px-2 py-0">+%mor</Button>
              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); addTier(sessionId, utterance.id, '%err:'); }} className="h-6 text-[10px] px-2 py-0">+%err</Button>
              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); addTier(sessionId, utterance.id, '%gra:'); }} className="h-6 text-[10px] px-2 py-0">+%gra</Button>
              <div className="flex-1" />
              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); removeUtterance(sessionId, utterance.id); }} className="h-6 px-2 py-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex w-12 shrink-0 flex-col items-end gap-1 pt-1">
        <div className="flex gap-1">
          {hasErrors && (
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
          )}
          {hasAiSuggestions && (
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          )}
        </div>
        {utterance.confidence !== undefined && (
          <div className="text-[10px] font-mono text-muted-foreground/70">
            {(utterance.confidence * 100).toFixed(0)}%
          </div>
        )}
      </div>
    </motion.div>
  );
};


