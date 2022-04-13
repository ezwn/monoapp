import React, { useEffect, useState } from 'react';
import { MODE, useDiagramUIContext } from '../shared/DiagramUI-ctx';
import { usePointingContext } from '../shared/Pointing-ctx';
import { useSelectionContext } from '../../../lib/Selection-ctx';
import { useDiagramInteractionContext } from '../diagram/DiagramInteraction-ctx';
import { Note } from './Note-mdl';
import { generateRandomTextId } from '../../../lib/js-utils/generateRandomTextId';
import { Command, CommandProvider } from '../shared/commands/Command-ctx';

const createNoteFn = (
  addElement: (category: string, element: Note) => void,
  pointedLocation: number[],
  setSelection: (selection: string[]) => void,
  setMode: (mode: MODE) => void
) => () => {
  const id = 'NOTE-' + generateRandomTextId(8);
  addElement('notes', {
    id,
    userBounds: [pointedLocation[0] - 4, pointedLocation[1] - 4],
    content: 'Note ' + id
  });

  setSelection([id]);
  setMode("EDITION");
};

export const NotePlugin: React.FC<{}> = ({ children }) => {
  const { addElement } = useDiagramInteractionContext();
  const { pointedLocation, pointedElement } = usePointingContext();
  const { selection, setSelection } = useSelectionContext();
  const { setMode } = useDiagramUIContext();

  const [commands, setCommands] = useState<Command[]>([]);

  useEffect(() => {
    setCommands([
      {
        shortcut: 'n',
        title: <>n. New note</>,
        isAvailable: () => !pointedElement && selection.length === 0,
        execute: createNoteFn(addElement, pointedLocation, setSelection, setMode)
      }
    ]);
  }, [addElement, pointedLocation, pointedElement, setSelection, setMode, selection]);

  return <CommandProvider commands={commands}>{children}</CommandProvider>;
};
