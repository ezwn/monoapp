import { useCallback, useEffect, useState } from 'react';
import { createHookBasedContext } from '../../../../lib/react-utils/createHookBasedContext';
import { useDiagramUIContext } from '../DiagramUI-ctx';
import { Command, useCommandContext } from './Command-ctx';

type KeyCommandDispatcherProps = {};

type KeyCommandDispatcherValue = {
  candidates: Command[];
};

const defaultValue: KeyCommandDispatcherValue = {
  candidates: [],
};

const useKeyCommandDispatcher: (props: KeyCommandDispatcherProps) => KeyCommandDispatcherValue = () => {
  const [sentence, setSentence] = useState<string>('');
  const [candidates, setCandidates] = useState<Command[]>(defaultValue.candidates);
  const { mode } = useDiagramUIContext();

  const { commands } = useCommandContext();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (mode === "EDITION") return;

    if (event.key === 'Escape') {
      setSentence('');
      return;
    }

    if (event.key.length > 1)
      return;

    setSentence(sentence + event.key);

  }, [mode, sentence]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (mode === "EDITION") return;

    setCandidates(commands.filter(listener => listener.shortcut.startsWith(sentence) && listener.isAvailable()));

    const listener = commands.find(listener => listener.isAvailable() && listener.shortcut === sentence);
    if (listener) {
      listener.execute();
      setSentence('');
    }
  }, [sentence, mode, commands]);

  return { candidates };
};

const hookBasedContext = createHookBasedContext(useKeyCommandDispatcher, defaultValue);

export const KeyCommandDispatcherProvider = hookBasedContext.Provider;
export const useKeyCommandDispatcherContext = hookBasedContext.useContext;
