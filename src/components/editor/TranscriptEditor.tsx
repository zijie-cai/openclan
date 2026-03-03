import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { UtteranceRow } from './UtteranceRow';
import { FileText, Save, CheckCircle2, Download } from 'lucide-react';
import { Button } from '../ui/button';

export const TranscriptEditor: React.FC = () => {
  const { patients, selectedPatientId, selectedSessionId, exportTranscript, updateHeader } = useAppStore();
  const [isSaving, setIsSaving] = useState(false);
  const [editingHeaderIndex, setEditingHeaderIndex] = useState<number | null>(null);
  const [headerText, setHeaderText] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const mediaRef = useRef<HTMLMediaElement>(null);

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime * 1000);
    }
  };

  const patient = patients.find(p => p.id === selectedPatientId);
  const session = patient?.sessions.find(s => s.id === selectedSessionId);

  const [playingUtteranceId, setPlayingUtteranceId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    
    const playingUtterance = session.transcript.utterances.find(
      u => u.timestamp && currentTime >= u.timestamp[0] && currentTime <= u.timestamp[1]
    );

    if (playingUtterance && playingUtterance.id !== playingUtteranceId) {
      setPlayingUtteranceId(playingUtterance.id);
      const el = document.getElementById(`utterance-${playingUtterance.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (!playingUtterance && playingUtteranceId) {
      setPlayingUtteranceId(null);
    }
  }, [currentTime, session, playingUtteranceId]);

  if (!session) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a session to view the transcript.
      </div>
    );
  }

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-12 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
          <FileText className="h-4 w-4 text-primary" />
          {patient?.name} - {session.date}.cha
        </div>
        <div className="flex items-center gap-2">
          {isSaving ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-primary" /> Saved
            </span>
          ) : (
            <Button variant="outline" size="sm" onClick={handleSave} className="h-7 gap-1 text-xs">
              <Save className="h-3 w-3" /> Save
            </Button>
          )}
          <Button variant="default" size="sm" onClick={() => exportTranscript(session.id)} className="h-7 gap-1 text-xs">
            <Download className="h-3 w-3" /> Export .cha
          </Button>
        </div>
      </div>

      {session.mediaUrl && (
        <div className="border-b border-border bg-secondary/30 p-2 flex justify-center">
          {session.mediaType?.startsWith('video/') ? (
            <video ref={mediaRef as any} onTimeUpdate={handleTimeUpdate} controls src={session.mediaUrl} className="h-48 w-auto max-w-full rounded-md shadow-sm" />
          ) : (
            <audio ref={mediaRef as any} onTimeUpdate={handleTimeUpdate} controls src={session.mediaUrl} className="h-8 w-full" />
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed">
        <div className="mb-6 rounded-md bg-secondary/50 p-4 text-muted-foreground border border-border">
          {session.transcript.header.map((line, i) => (
            <div key={i} className="mb-1">
              {editingHeaderIndex === i ? (
                <input
                  autoFocus
                  type="text"
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  onBlur={() => {
                    updateHeader(session.id, i, headerText);
                    setEditingHeaderIndex(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateHeader(session.id, i, headerText);
                      setEditingHeaderIndex(null);
                    }
                  }}
                  className="w-full bg-background border border-border rounded px-2 py-1 outline-none focus:border-primary text-foreground"
                />
              ) : (
                <div 
                  onDoubleClick={() => {
                    setEditingHeaderIndex(i);
                    setHeaderText(line);
                  }}
                  className="cursor-pointer hover:text-foreground transition-colors"
                >
                  {line}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {session.transcript.utterances.map((utterance) => {
            const isPlaying = utterance.timestamp 
              ? currentTime >= utterance.timestamp[0] && currentTime <= utterance.timestamp[1]
              : false;
            
            return (
              <UtteranceRow 
                key={utterance.id} 
                utterance={utterance} 
                sessionId={session.id} 
                isPlaying={isPlaying}
              />
            );
          })}
        </div>
        
        <div className="mt-4 flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => useAppStore.getState().addUtterance(session.id)}
            className="text-muted-foreground"
          >
            + Add Utterance
          </Button>
        </div>
      </div>
    </div>
  );
};

