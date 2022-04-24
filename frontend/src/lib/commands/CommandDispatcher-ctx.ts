import { useCallback, useEffect, useState } from 'react';
import { createHookBasedContext } from '../react-utils/createHookBasedContext';
import { Command, useCommandContext } from './Command-ctx';

type CommandDispatcherProps = {};

type CommandDispatcherValue = {
  enabled: boolean;
  sentence: string;
  candidates: Command[];
  setEnabled: (enabled: boolean) => void;
};

const defaultValue: CommandDispatcherValue = {
  enabled: true,
  sentence: '',
  candidates: [],
  setEnabled: () => { }
};

const useCommandDispatcher: (props: CommandDispatcherProps) => CommandDispatcherValue = () => {
  const [sentence, setSentence] = useState<string>(defaultValue.sentence);
  const [candidates, setCandidates] = useState<Command[]>(defaultValue.candidates);
  const { commands } = useCommandContext();
  const [enabled, setEnabled] = useState<boolean>(defaultValue.enabled);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    if (event.key === 'Escape') {
      setSentence('');
      return;
    }

    if (event.key === 'Backspace' && sentence.length>0) {
      setSentence(sentence.substring(0, sentence.length-1));
      return;
    }

    if (event.key.length > 1)
      return;

    setSentence(sentence + event.key.toLowerCase());

  }, [enabled, sentence]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (!enabled) return;

    setCandidates(commands.filter(listener => listener.shortcut.startsWith(sentence) && listener.isAvailable()));

    const listener = commands.find(listener => listener.isAvailable() && listener.shortcut === sentence);
    if (listener) {
      listener.execute();
      setSentence('');
    }
  }, [sentence, enabled, commands]);

  return { sentence, candidates, enabled, setEnabled };
};

const hookBasedContext = createHookBasedContext(useCommandDispatcher, defaultValue);

export const CommandDispatcherProvider = hookBasedContext.Provider;
export const useCommandDispatcherContext = hookBasedContext.useContext;
