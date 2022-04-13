import { useCallback, useEffect, useState } from 'react';
import { loadFileNull, saveJSONFile } from '../../../lib/fs4webapp-client';
import { createHookBasedContext } from '../../../lib/react-utils/createHookBasedContext';
import { Diagram } from './Diagram-mdl';

export type DiagramPersistenceProps = {
  diagramId?: string;
};

export type DiagramPersistenceValue = {
  diagram: Diagram | null;
  saveDiagram: (diagram: Diagram) => void;
};

export const defaultValue: DiagramPersistenceValue = {
  diagram: null,
  saveDiagram: () => { }
};

export const useDiagramPersistence: (props: DiagramPersistenceProps) => DiagramPersistenceValue = ({ diagramId }) => {
  const [diagram, setDiagram] = useState<Diagram | null>(defaultValue.diagram);

  useEffect(() => {
    async function fetch() {
      const diagram = diagramId ? await loadFileNull<Diagram>(diagramId) : null;
      setDiagram(diagram);
    }

    fetch();
  }, [diagramId]);

  const saveDiagram = useCallback((diagram: Diagram) => {
    setDiagram(diagram);

    if (!diagramId || !diagram) return;

    saveJSONFile<Diagram>(diagramId, diagram);
  }, [diagramId]);

  return { diagram, saveDiagram };
};

const hookBasedContext = createHookBasedContext(useDiagramPersistence, defaultValue);

export const DiagramPersistenceProvider = hookBasedContext.Provider;
export const useDiagramPersistenceContext = hookBasedContext.useContext;
