import { create } from 'zustand';
import { Patient, Session, Utterance, CommandResult } from '../types';
import { MOCK_PATIENTS } from '../lib/mockData';
import { transcribeAudio } from '../services/transcriptionService';

interface AppState {
  isLandingPage: boolean;
  patients: Patient[];
  selectedPatientId: string | null;
  selectedSessionId: string | null;
  activeUtteranceId: string | null;
  consoleHistory: CommandResult[];
  isAnalyticsMode: boolean;
  aiEnabled: boolean;
  isProcessingAudio: boolean;
  processingProgress: number;
  isConsoleOpen: boolean;
  isSettingsOpen: boolean;
  geminiApiKey: string;
  batchQueue: File[];
  history: { id: string; filename: string; date: string; status: 'success' | 'failed' }[];

  // Actions
  selectPatient: (id: string) => void;
  selectSession: (id: string) => void;
  selectUtterance: (id: string) => void;
  toggleAnalyticsMode: () => void;
  toggleAi: () => void;
  toggleConsole: () => void;
  toggleSettings: () => void;
  setGeminiApiKey: (apiKey: string) => void;
  clearGeminiApiKey: () => void;
  addToBatchQueue: (files: FileList | File[]) => void;
  processBatchQueue: () => Promise<void>;
  clearHistory: () => void;
  runCommand: (command: string) => void;
  updateUtterance: (sessionId: string, utteranceId: string, newText: string, newSpeaker?: string) => void;
  updateUtteranceTimestamp: (sessionId: string, utteranceId: string, timestamp: [number, number] | undefined) => void;
  removeUtterance: (sessionId: string, utteranceId: string) => void;
  uploadTranscript: (filename: string, content: string) => void;
  addTier: (sessionId: string, utteranceId: string, type: string) => void;
  updateTier: (sessionId: string, utteranceId: string, tierIndex: number, text: string) => void;
  processAudioFile: (file: File) => Promise<void>;
  exportTranscript: (sessionId: string) => void;
  addPatient: (name: string) => void;
  createSession: (patientId: string) => void;
  updateHeader: (sessionId: string, lineIndex: number, text: string) => void;
  addUtterance: (sessionId: string) => void;
  startApp: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isLandingPage: true,
  patients: [],
  selectedPatientId: null,
  selectedSessionId: null,
  activeUtteranceId: null,
  consoleHistory: [],
  isAnalyticsMode: false,
  aiEnabled: true,
  isProcessingAudio: false,
  processingProgress: 0,
  isConsoleOpen: false,
  isSettingsOpen: false,
  geminiApiKey: typeof window !== 'undefined' ? localStorage.getItem('openclan_gemini_api_key') || '' : '',
  batchQueue: [],
  history: [],

  selectPatient: (id) => set((state) => {
    const patient = state.patients.find(p => p.id === id);
    return {
      selectedPatientId: id,
      selectedSessionId: patient?.sessions[0]?.id || null,
      activeUtteranceId: null,
      isAnalyticsMode: false,
    };
  }),

  selectSession: (id) => set({ selectedSessionId: id, activeUtteranceId: null, isAnalyticsMode: false }),
  
  selectUtterance: (id) => set({ activeUtteranceId: id }),
  
  toggleAnalyticsMode: () => set((state) => ({ isAnalyticsMode: !state.isAnalyticsMode })),
  
  toggleAi: () => set((state) => ({ aiEnabled: !state.aiEnabled })),

  toggleConsole: () => set((state) => ({ isConsoleOpen: !state.isConsoleOpen })),

  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),

  setGeminiApiKey: (apiKey) => {
    const trimmed = apiKey.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('openclan_gemini_api_key', trimmed);
    }
    set({ geminiApiKey: trimmed });
  },

  clearGeminiApiKey: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('openclan_gemini_api_key');
    }
    set({ geminiApiKey: '' });
  },

  addToBatchQueue: (files) => set((state) => {
    const newFiles = Array.from(files);
    return { batchQueue: [...state.batchQueue, ...newFiles] };
  }),

  processBatchQueue: async () => {
    const state = get();
    if (state.batchQueue.length === 0 || state.isProcessingAudio) return;

    set({ isProcessingAudio: true, processingProgress: 0 });
    const queue = [...state.batchQueue];
    set({ batchQueue: [] });

    for (let i = 0; i < queue.length; i++) {
      const file = queue[i];
      try {
        await get().processAudioFile(file);
        set((state) => ({
          history: [{ id: Math.random().toString(36).substring(7), filename: file.name, date: new Date().toLocaleDateString(), status: 'success' }, ...state.history]
        }));
      } catch (error) {
        set((state) => ({
          history: [{ id: Math.random().toString(36).substring(7), filename: file.name, date: new Date().toLocaleDateString(), status: 'failed' }, ...state.history]
        }));
      }
    }
    set({ isProcessingAudio: false, processingProgress: 100 });
  },

  clearHistory: () => set({ history: [] }),

  runCommand: (command) => {
    const newResult: CommandResult = {
      id: Math.random().toString(36).substring(7),
      command,
      timestamp: new Date(),
      rawOutput: `Executing: ${command}\n...`,
    };

    // Simulate CLAN command parsing
    if (command.startsWith('MLU')) {
      newResult.rawOutput += '\nMLU for *PAR: 2.100\nRatio of words over utterances: 21/10';
      newResult.parsedData = { mlu: 2.1 };
    } else if (command.startsWith('FREQ')) {
      newResult.rawOutput += '\n1 stroke\n1 hospital\n1 yes';
      newResult.parsedData = { freq: [{ word: 'stroke', count: 1 }, { word: 'hospital', count: 1 }] };
    } else if (command.startsWith('EVAL')) {
      newResult.rawOutput += '\nEVAL summary:\nTokens: 15\nTypes: 12\nTTR: 0.800';
    } else {
      newResult.rawOutput += '\nCommand completed successfully.';
    }

    set((state) => ({ consoleHistory: [...state.consoleHistory, newResult] }));
  },

  updateUtterance: (sessionId, utteranceId, newText, newSpeaker) => set((state) => {
    const newPatients = state.patients.map(p => {
      const newSessions = p.sessions.map(s => {
        if (s.id === sessionId) {
          const newUtterances = s.transcript.utterances.map(u => {
            if (u.id === utteranceId) {
              return { ...u, text: newText, speaker: newSpeaker || u.speaker };
            }
            return u;
          });
          return { ...s, transcript: { ...s.transcript, utterances: newUtterances } };
        }
        return s;
      });
      return { ...p, sessions: newSessions };
    });
    return { patients: newPatients };
  }),

  updateUtteranceTimestamp: (sessionId, utteranceId, timestamp) => set((state) => {
    const newPatients = state.patients.map(p => {
      const newSessions = p.sessions.map(s => {
        if (s.id === sessionId) {
          const newUtterances = s.transcript.utterances.map(u => {
            if (u.id === utteranceId) {
              return { ...u, timestamp };
            }
            return u;
          });
          return { ...s, transcript: { ...s.transcript, utterances: newUtterances } };
        }
        return s;
      });
      return { ...p, sessions: newSessions };
    });
    return { patients: newPatients };
  }),

  removeUtterance: (sessionId, utteranceId) => set((state) => {
    const newPatients = state.patients.map(p => {
      const newSessions = p.sessions.map(s => {
        if (s.id === sessionId) {
          const newUtterances = s.transcript.utterances.filter(u => u.id !== utteranceId);
          return { ...s, transcript: { ...s.transcript, utterances: newUtterances } };
        }
        return s;
      });
      return { ...p, sessions: newSessions };
    });
    return { patients: newPatients, activeUtteranceId: state.activeUtteranceId === utteranceId ? null : state.activeUtteranceId };
  }),

  uploadTranscript: (filename, content) => set((state) => {
    const lines = content.split('\n');
    const header: string[] = [];
    const utterances: Utterance[] = [];
    let currentUtterance: Utterance | null = null;

    for (const line of lines) {
      if (line.startsWith('@')) {
        header.push(line);
      } else if (line.startsWith('*')) {
        if (currentUtterance) utterances.push(currentUtterance);
        const colonIdx = line.indexOf(':');
        const speaker = colonIdx > -1 ? line.substring(0, colonIdx).trim() : line.substring(0, 4).trim();
        let text = colonIdx > -1 ? line.substring(colonIdx + 1).trim() : line.substring(4).trim();
        
        let timestamp: [number, number] | undefined;
        const timestampMatch = text.match(/\x15(\d+)_(\d+)\x15/);
        if (timestampMatch) {
          timestamp = [parseInt(timestampMatch[1], 10), parseInt(timestampMatch[2], 10)];
          text = text.replace(/\x15\d+_\d+\x15/, '').trim();
        }

        currentUtterance = {
          id: Math.random().toString(36).substring(7),
          speaker,
          text,
          timestamp,
          confidence: Math.random() * 0.2 + 0.8, // 0.8 to 1.0
          dependentTiers: [],
          metrics: { mlu: 0, typeTokenRatio: 0, errors: [] },
          aiSuggestions: []
        };
      } else if (line.startsWith('%') && currentUtterance) {
        const colonIdx = line.indexOf(':');
        const type = colonIdx > -1 ? line.substring(0, colonIdx).trim() : line.substring(0, 4).trim();
        const text = colonIdx > -1 ? line.substring(colonIdx + 1).trim() : line.substring(4).trim();
        currentUtterance.dependentTiers.push({ type, text });
      } else if (currentUtterance && line.trim().length > 0) {
        if (currentUtterance.dependentTiers.length > 0) {
           currentUtterance.dependentTiers[currentUtterance.dependentTiers.length - 1].text += ' ' + line.trim();
        } else {
           currentUtterance.text += ' ' + line.trim();
        }
      }
    }
    if (currentUtterance) utterances.push(currentUtterance);

    let totalWords = 0;
    let uniqueWords = new Set<string>();
    let parUtterances = 0;
    let errorCount = 0;

    utterances.forEach(u => {
       if (u.speaker === '*PAR') {
         parUtterances++;
         const words = u.text.split(/\s+/).filter(w => w.match(/[a-zA-Z]/));
         totalWords += words.length;
         words.forEach(w => uniqueWords.add(w.toLowerCase()));
         u.metrics = { mlu: words.length, typeTokenRatio: words.length ? new Set(words).size / words.length : 0, errors: [] };
         
         // Mock AI Analysis
         if (state.aiEnabled && Math.random() > 0.7) {
           u.aiSuggestions = [{
             id: Math.random().toString(36).substring(7),
             type: 'error_tag',
             text: 'Potential word finding difficulty',
             confidence: 0.85,
             explanation: 'Pause or filler detected in context.'
           }];
         }
       }
       u.dependentTiers.forEach(t => {
         if (t.type === '%err') errorCount++;
       });
    });

    const sessionMetrics = {
      mlu: parUtterances > 0 ? totalWords / parUtterances : 0,
      ttr: totalWords > 0 ? uniqueWords.size / totalWords : 0,
      corelexCoverage: Math.floor(Math.random() * 40) + 40,
      errorCount
    };

    const newSession: Session = {
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString().split('T')[0] + ' (Uploaded)',
      transcript: { header, utterances },
      metrics: sessionMetrics
    };

    const newPatient: Patient = {
      id: Math.random().toString(36).substring(7),
      name: filename.replace('.cha', ''),
      type: 'aphasia',
      sessions: [newSession]
    };

    return {
      patients: [...state.patients, newPatient],
      selectedPatientId: newPatient.id,
      selectedSessionId: newSession.id,
      activeUtteranceId: utterances[0]?.id || null,
      isAnalyticsMode: false
    };
  }),

  addTier: (sessionId, utteranceId, type) => set((state) => {
    const newPatients = state.patients.map(p => {
      const newSessions = p.sessions.map(s => {
        if (s.id === sessionId) {
          const newUtterances = s.transcript.utterances.map(u => {
            if (u.id === utteranceId) {
              return { ...u, dependentTiers: [...u.dependentTiers, { type, text: '' }] };
            }
            return u;
          });
          return { ...s, transcript: { ...s.transcript, utterances: newUtterances } };
        }
        return s;
      });
      return { ...p, sessions: newSessions };
    });
    return { patients: newPatients };
  }),

  updateTier: (sessionId, utteranceId, tierIndex, text) => set((state) => {
    const newPatients = state.patients.map(p => {
      const newSessions = p.sessions.map(s => {
        if (s.id === sessionId) {
          const newUtterances = s.transcript.utterances.map(u => {
            if (u.id === utteranceId) {
              const newTiers = [...u.dependentTiers];
              newTiers[tierIndex] = { ...newTiers[tierIndex], text };
              return { ...u, dependentTiers: newTiers };
            }
            return u;
          });
          return { ...s, transcript: { ...s.transcript, utterances: newUtterances } };
        }
        return s;
      });
      return { ...p, sessions: newSessions };
    });
    return { patients: newPatients };
  }),

  processAudioFile: async (file: File) => {
    const { geminiApiKey } = get();
    if (!geminiApiKey) {
      alert("Please add your Gemini API key in Settings before uploading media.");
      return;
    }

    set({ isProcessingAudio: true, processingProgress: 0 });
    
    const mediaUrl = URL.createObjectURL(file);
    const filename = file.name.replace(/\.[^/.]+$/, "");

    try {
      const utterances = await transcribeAudio(file, geminiApiKey, (progress) => {
        set({ processingProgress: progress });
      });

      const header = [
        '@Begin',
        '@Languages:\teng',
        `@Participants:\tPAR Patient Aphasia, INV Investigator`,
        `@ID:\teng|openclan|PAR|55;|male|Aphasia||Patient|||`,
        `@Media:\t${filename}, audio`
      ];

      let totalWords = 0;
      let uniqueWords = new Set<string>();
      let parUtterances = 0;
      let errorCount = 0;

      utterances.forEach(u => {
         if (u.speaker === '*PAR') {
           parUtterances++;
           const words = u.text.split(/\s+/).filter(w => w.match(/[a-zA-Z]/));
           totalWords += words.length;
           words.forEach(w => uniqueWords.add(w.toLowerCase()));
         }
         u.dependentTiers.forEach(t => {
           if (t.type === '%err:') errorCount++;
         });
      });

      const sessionMetrics = {
        mlu: parUtterances > 0 ? totalWords / parUtterances : 0,
        ttr: totalWords > 0 ? uniqueWords.size / totalWords : 0,
        corelexCoverage: Math.floor(Math.random() * 40) + 40,
        errorCount
      };

      const newSession: Session = {
        id: Math.random().toString(36).substring(7),
        date: new Date().toISOString().split('T')[0] + ' (ASR)',
        transcript: { header, utterances },
        metrics: sessionMetrics,
        mediaUrl,
        mediaType: file.type || (file.name.endsWith('.mp4') ? 'video/mp4' : 'audio/wav')
      };

      const newPatient: Patient = {
        id: Math.random().toString(36).substring(7),
        name: filename,
        type: 'aphasia',
        sessions: [newSession]
      };

      set((state) => ({
        patients: [...state.patients, newPatient],
        selectedPatientId: newPatient.id,
        selectedSessionId: newSession.id,
        activeUtteranceId: utterances[0]?.id || null,
        isAnalyticsMode: false,
        isProcessingAudio: false,
        processingProgress: 100
      }));
    } catch (error) {
      console.error("Failed to process audio:", error);
      set({ isProcessingAudio: false, processingProgress: 0 });
      alert("Failed to transcribe audio. Please check your API key and try again.");
    }
  },

  exportTranscript: (sessionId: string) => {
    const state = get();
    let session: Session | undefined;
    
    for (const p of state.patients) {
      const s = p.sessions.find(s => s.id === sessionId);
      if (s) {
        session = s;
        break;
      }
    }

    if (!session) return;

    let content = session.transcript.header.join('\n') + '\n';
    
    session.transcript.utterances.forEach(u => {
      let line = `${u.speaker}:\t${u.text}`;
      if (u.timestamp) {
        line += ` \x15${u.timestamp[0]}_${u.timestamp[1]}\x15`;
      }
      content += line + '\n';
      u.dependentTiers.forEach(t => {
        content += `${t.type}\t${t.text}\n`;
      });
    });
    
    content += '@End\n';

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.date.replace(/[^a-zA-Z0-9]/g, '_')}.cha`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  addPatient: (name: string) => set((state) => {
    const newPatient: Patient = {
      id: Math.random().toString(36).substring(7),
      name,
      type: 'aphasia',
      sessions: []
    };
    return {
      patients: [...state.patients, newPatient],
      selectedPatientId: newPatient.id,
      selectedSessionId: null,
      activeUtteranceId: null
    };
  }),

  createSession: (patientId: string) => set((state) => {
    const newSession: Session = {
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString().split('T')[0] + ' (New)',
      transcript: { 
        header: [
          '@Begin',
          '@Languages:\teng',
          `@Participants:\tPAR Patient Aphasia, INV Investigator`,
          `@ID:\teng|openclan|PAR|55;|male|Aphasia||Patient|||`
        ], 
        utterances: [] 
      },
      metrics: { mlu: 0, ttr: 0, corelexCoverage: 0, errorCount: 0 }
    };

    const newPatients = state.patients.map(p => {
      if (p.id === patientId) {
        return { ...p, sessions: [...p.sessions, newSession] };
      }
      return p;
    });

    return {
      patients: newPatients,
      selectedSessionId: newSession.id,
      activeUtteranceId: null
    };
  }),

  updateHeader: (sessionId: string, lineIndex: number, text: string) => set((state) => {
    const newPatients = state.patients.map(p => {
      const newSessions = p.sessions.map(s => {
        if (s.id === sessionId) {
          const newHeader = [...s.transcript.header];
          newHeader[lineIndex] = text;
          return { ...s, transcript: { ...s.transcript, header: newHeader } };
        }
        return s;
      });
      return { ...p, sessions: newSessions };
    });
    return { patients: newPatients };
  }),

  addUtterance: (sessionId: string) => set((state) => {
    const newUtterance: Utterance = {
      id: Math.random().toString(36).substring(7),
      speaker: '*PAR',
      text: '',
      dependentTiers: [],
      metrics: { mlu: 0, typeTokenRatio: 0, errors: [] }
    };

    const newPatients = state.patients.map(p => {
      const newSessions = p.sessions.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            transcript: {
              ...s.transcript,
              utterances: [...s.transcript.utterances, newUtterance]
            }
          };
        }
        return s;
      });
      return { ...p, sessions: newSessions };
    });

    return { patients: newPatients, activeUtteranceId: newUtterance.id };
  }),

  startApp: () => set({ isLandingPage: false })
}));
