import React, { useCallback, useEffect, useState } from 'react';
import { Command, CommandProvider } from '../commands/Command-ctx';
import { useNavigatorPersistenceContext } from '../file-browsing/NavigatorPersistence-ctx';
import { popState } from '../git';
import { useUndoContext } from './Undo-ctx';

const useUndoFn = () => {
  const { lastUndo, setLastUndo } = useUndoContext();
  const { currentFile } = useNavigatorPersistenceContext();

  return useCallback(async () => {
    await popState(currentFile);
    setLastUndo(lastUndo + 1);
  }, [lastUndo, setLastUndo, currentFile]);
}

export const UndoPlugin: React.FC<{}> = ({ children }) => {
  const [commands, setCommands] = useState<Command[]>([]);
  const undoFn = useUndoFn();

  useEffect(() => {
    setCommands([
      {
        shortcut: 'udo',
        title: <>udo. Undo</>,
        isAvailable: () => true,
        execute: undoFn
      }
    ]);
  }, [undoFn]);

  return <CommandProvider commands={commands}>{children}</CommandProvider>;
};
