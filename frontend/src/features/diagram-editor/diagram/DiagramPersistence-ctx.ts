import { useCallback, useEffect, useState } from 'react';
import { loadFileNull, saveJSONFile } from '../../../lib/fs4webapp-client';
import { createHookBasedContext, useContextValueObject } from '../../../lib/react-utils/createHookBasedContext';
import { useUndoContext } from '../../../lib/undo/Undo-ctx';
import { Diagram } from './Diagram-mdl';

export type DiagramPersistenceProps = {
  diagramId?: string;
};

export type DiagramPersistenceValue = {
  diagram: Diagram | null;
  saveDiagram: (diagram: Diagram) => void;
};

const defaultValue: DiagramPersistenceValue = {
  diagram: null,
  saveDiagram: () => { }
};

const useDiagramPersistence: (props: DiagramPersistenceProps) => DiagramPersistenceValue = ({ diagramId }) => {
  const [diagram, setDiagram] = useState<Diagram | null>(defaultValue.diagram);
  const { lastUndo } = useUndoContext();

  useEffect(() => {
    async function fetch() {
      const diagram = diagramId ? await loadFileNull<Diagram>(diagramId) : null;
      setDiagram(diagram);
    }

    fetch();
  }, [diagramId, lastUndo]);

  const saveDiagram = useCallback(async (diagram: Diagram) => {
    setDiagram(diagram);

    if (!diagramId || !diagram) return;

    await saveJSONFile<Diagram>(diagramId, diagram);
  }, [diagramId]);

  return useContextValueObject({ diagram, saveDiagram }, defaultValue) as DiagramPersistenceValue;
};

const hookBasedContext = createHookBasedContext(useDiagramPersistence, defaultValue);

export const DiagramPersistenceProvider = hookBasedContext.Provider;
export const useDiagramPersistenceContext = hookBasedContext.useContext;
