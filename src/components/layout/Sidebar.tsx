import React, { useState, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Folder, FileText, Clock, Users, Database, Plus, UploadCloud, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../ui/button';
import { motion, AnimatePresence } from 'motion/react';

export const Sidebar: React.FC = () => {
  const { patients, selectedPatientId, selectedSessionId, selectPatient, selectSession, addPatient, batchQueue, addToBatchQueue, processBatchQueue, isProcessingAudio, history, clearHistory } = useAppStore();
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePatient = () => {
    if (newPatientName.trim()) {
      addPatient(newPatientName.trim());
      setNewPatientName('');
      setIsCreatingPatient(false);
    }
  };

  const handleBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addToBatchQueue(e.target.files);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card">
      <div className="flex h-12 items-center border-b border-border px-4 font-semibold text-foreground">
        <Database className="mr-2 h-4 w-4 text-primary" />
        Corpus Explorer
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Patients</span>
            <button 
              onClick={() => setIsCreatingPatient(true)}
              className="hover:text-primary transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {isCreatingPatient && (
            <div className="mb-2 px-2">
              <input
                autoFocus
                type="text"
                placeholder="Patient Name"
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreatePatient();
                  if (e.key === 'Escape') setIsCreatingPatient(false);
                }}
                onBlur={() => {
                  if (newPatientName.trim()) handleCreatePatient();
                  else setIsCreatingPatient(false);
                }}
                className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm outline-none focus:border-primary"
              />
            </div>
          )}

          {patients.map((patient) => (
            <div key={patient.id} className="mb-1">
              <button
                onClick={() => selectPatient(patient.id)}
                className={cn(
                  'flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  selectedPatientId === patient.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                )}
              >
                <Users className="mr-2 h-4 w-4" />
                {patient.name}
              </button>

              <AnimatePresence>
                {selectedPatientId === patient.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-4 mt-1 space-y-1 border-l border-border pl-2 overflow-hidden"
                  >
                    {patient.sessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => selectSession(session.id)}
                        className={cn(
                          'flex w-full items-center rounded-md px-2 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                          selectedSessionId === session.id
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground'
                        )}
                      >
                        <FileText className="mr-2 h-3.5 w-3.5" />
                        {session.date}
                      </button>
                    ))}
                    <button
                      onClick={() => useAppStore.getState().createSession(patient.id)}
                      className="flex w-full items-center rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Plus className="mr-2 h-3.5 w-3.5" />
                      New Session
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Batch Queue
          </div>
          <input type="file" multiple accept="audio/*,video/*,.mp4,.wav,.mp3" className="hidden" ref={fileInputRef} onChange={handleBatchUpload} />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            Add Files...
          </button>
          <button 
            onClick={processBatchQueue}
            disabled={batchQueue.length === 0 || isProcessingAudio}
            className={cn(
              "flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
              batchQueue.length > 0 && !isProcessingAudio 
                ? "text-primary hover:bg-primary/10" 
                : "text-muted-foreground opacity-50 cursor-not-allowed"
            )}
          >
            <Folder className="mr-2 h-4 w-4" />
            Process All ({batchQueue.length})
          </button>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              History
            </div>
            {history.length > 0 && (
              <span className="text-xs bg-secondary px-1.5 rounded-full">{history.length}</span>
            )}
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 space-y-1 overflow-hidden px-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Recent</span>
                  <button onClick={clearHistory} className="text-xs text-muted-foreground hover:text-destructive flex items-center">
                    <Trash2 className="h-3 w-3 mr-1" /> Clear
                  </button>
                </div>
                {history.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic py-2 text-center">No history</div>
                ) : (
                  history.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0">
                      <span className="truncate max-w-[140px]" title={item.filename}>{item.filename}</span>
                      {item.status === 'success' ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-destructive" />
                      )}
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
};
