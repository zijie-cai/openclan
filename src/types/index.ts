export type PatientType = 'aphasia' | 'control';

export interface Patient {
  id: string;
  name: string;
  type: PatientType;
  sessions: Session[];
}

export interface Session {
  id: string;
  date: string;
  transcript: Transcript;
  metrics: SessionMetrics;
  mediaUrl?: string;
  mediaType?: string;
}

export interface Transcript {
  header: string[];
  utterances: Utterance[];
}

export interface DependentTier {
  type: string; // e.g., '%mor', '%err', '%gra'
  text: string;
}

export interface AISuggestion {
  id: string;
  type: 'error_tag' | 'syntactic' | 'semantic' | 'diarization';
  text: string;
  confidence: number;
  explanation: string;
}

export interface UtteranceMetrics {
  mlu: number;
  typeTokenRatio: number;
  errors: string[];
}

export interface Utterance {
  id: string;
  speaker: string; // e.g., '*PAR', '*INV'
  text: string;
  timestamp?: [number, number]; // [startMs, endMs]
  confidence?: number; // 0-1
  dependentTiers: DependentTier[];
  metrics?: UtteranceMetrics;
  aiSuggestions?: AISuggestion[];
}

export interface SessionMetrics {
  mlu: number;
  ttr: number;
  corelexCoverage: number;
  errorCount: number;
}

export interface CommandResult {
  id: string;
  command: string;
  timestamp: Date;
  rawOutput: string;
  parsedData?: any;
}
