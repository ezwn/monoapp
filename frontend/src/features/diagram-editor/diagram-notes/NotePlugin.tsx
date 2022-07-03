import React, { useCallback, useEffect, useState } from 'react';
import { useDiagramUIContext } from '../shared/DiagramUI-ctx';
import { usePointingContext } from '../shared/Pointing-ctx';
import { useSelectionContext } from '../../../lib/Selection-ctx';
import { useDiagramInteractionContext } from '../diagram/DiagramInteraction-ctx';
import { generateRandomTextId } from '../../../lib/js-utils/generateRandomTextId';
import { Command, CommandProvider } from '../../../lib/commands/Command-ctx';
import { pushState } from '../../../lib/git';
import { useNavigatorPersistenceContext } from '../../../lib/file-browsing/NavigatorPersistence-ctx';

const useCreateNoteFn = () => {
  const { addElement } = useDiagramInteractionContext();
  const { pointedLocation } = usePointingContext();
  const { setSelection } = useSelectionContext();
  const { setMode } = useDiagramUIContext();
  const { currentFile } = useNavigatorPersistenceContext();

  return useCallback(async () => {
    
    const id = 'NOTE-' + generateRandomTextId(8);

    await addElement('notes', {
      id,
      userBounds: [pointedLocation[0] - 4, pointedLocation[1] - 4],
      content: 'Note ' + id
    });

    pushState(currentFile, "Create note");

    setSelection([id]);
    setMode("EDITION");
  }, [addElement, pointedLocation, setSelection, setMode, currentFile]);
}

export const NotePlugin: React.FC<{}> = ({ children }) => {
  const [commands, setCommands] = useState<Command[]>([]);
  
  const { selection } = useSelectionContext();
  const createNoteFn = useCreateNoteFn();
  const { pointedElement } = usePointingContext();

  useEffect(() => {
    setCommands([
      {
        shortcut: 'n',
        title: <>n. New note</>,
        isAvailable: () => !pointedElement && selection.length === 0,
        execute: createNoteFn
      }
    ]);
  }, [createNoteFn, pointedElement, selection]);

  return <CommandProvider commands={commands}>{children}</CommandProvider>;
};
