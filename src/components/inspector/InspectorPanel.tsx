import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Activity, Sparkles, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'motion/react';

export const InspectorPanel: React.FC = () => {
  const { patients, selectedPatientId, selectedSessionId, activeUtteranceId, aiEnabled } = useAppStore();

  const patient = patients.find(p => p.id === selectedPatientId);
  const session = patient?.sessions.find(s => s.id === selectedSessionId);
  const utterance = session?.transcript.utterances.find(u => u.id === activeUtteranceId);

  if (!utterance) {
    return (
      <div className="flex w-80 flex-col border-l border-border bg-card p-4 text-sm text-muted-foreground">
        <div className="flex h-full items-center justify-center text-center">
          Select an utterance to view details.
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-80 flex-col border-l border-border bg-card">
      <div className="flex h-12 items-center border-b border-border px-4 font-semibold text-foreground">
        <Activity className="mr-2 h-4 w-4 text-primary" />
        Inspector
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={utterance.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Metrics */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Utterance Metrics
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border border-border bg-background p-2">
                  <div className="text-xs text-muted-foreground">MLU</div>
                  <div className="font-mono text-lg font-bold text-foreground">
                    {utterance.metrics?.mlu?.toFixed(2) || '-'}
                  </div>
                </div>
                <div className="rounded-md border border-border bg-background p-2">
                  <div className="text-xs text-muted-foreground">TTR</div>
                  <div className="font-mono text-lg font-bold text-foreground">
                    {utterance.metrics?.typeTokenRatio?.toFixed(2) || '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Errors */}
            {utterance.metrics?.errors && utterance.metrics.errors.length > 0 && (
              <div>
                <h3 className="mb-2 flex items-center text-xs font-semibold uppercase tracking-wider text-destructive">
                  <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                  Detected Errors
                </h3>
                <div className="space-y-2">
                  {utterance.metrics.errors.map((error, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-2 py-1 text-sm text-destructive-foreground">
                      <span className="font-mono font-bold">${error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {aiEnabled && utterance.aiSuggestions && utterance.aiSuggestions.length > 0 && (
              <div>
                <h3 className="mb-2 flex items-center text-xs font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  AI Copilot Suggestions
                </h3>
                <div className="space-y-3">
                  {utterance.aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="rounded-md border border-primary/20 bg-primary/5 p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium text-primary uppercase">{suggestion.type.replace('_', ' ')}</span>
                        <span className="text-xs font-mono text-muted-foreground">{(suggestion.confidence * 100).toFixed(0)}% conf</span>
                      </div>
                      <div className="mb-2 text-sm text-foreground">{suggestion.text}</div>
                      <div className="mb-3 text-xs text-muted-foreground">{suggestion.explanation}</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="default" className="h-7 flex-1 gap-1 text-xs">
                          <CheckCircle2 className="h-3 w-3" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 flex-1 gap-1 text-xs">
                          <XCircle className="h-3 w-3" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
