import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, XCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/button';

export const PowerConsole: React.FC = () => {
  const { consoleHistory, runCommand } = useAppStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    runCommand(input);
    setInput('');
  };

  return (
    <div className="flex h-64 flex-col border-t border-border bg-card">
      <div className="flex h-10 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2 font-mono text-sm font-semibold text-primary">
          <Terminal className="h-4 w-4" />
          Power Console
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => useAppStore.getState().toggleConsole()}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {consoleHistory.map((entry) => (
          <div key={entry.id} className="mb-4">
            <div className="flex items-center text-muted-foreground">
              <span className="mr-2 text-primary">❯</span>
              {entry.command}
            </div>
            <div className="mt-1 whitespace-pre-wrap text-foreground">
              {entry.rawOutput}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center border-t border-border bg-background px-4 py-2">
        <span className="mr-2 font-mono text-primary">❯</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="EVAL +t*CHI +u FREQ +s'dog' MLU CORELEX"
          className="flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <Button type="submit" size="sm" variant="ghost" className="h-8 px-2 text-primary hover:bg-primary/20 hover:text-primary">
          <Play className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
