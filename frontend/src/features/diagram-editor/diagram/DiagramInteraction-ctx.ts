import { useCallback } from 'react';
import { createHookBasedContext, useContextValueObject } from '../../../lib/react-utils/createHookBasedContext';
import { Diagram, DiagramElement } from './Diagram-mdl';
import { useDiagramPersistenceContext } from './DiagramPersistence-ctx';

export type DiagramInteractionProps = {};

export type AddDiagramElementFn = <T extends DiagramElement>(category: string, element: T) => void;
export type SelectDiagramElementFn = (selectFn: (e: DiagramElement) => boolean) => DiagramElement[];

export type DiagramInteractionValue = {
  diagram: Diagram | null;
  keepElements(filterFn: (e: DiagramElement) => boolean): void;
  selectElements(selectFn: (e: DiagramElement) => boolean): DiagramElement[];
  mapElements(mapFn: (e: DiagramElement) => DiagramElement): void;
  addElement<T extends DiagramElement>(category: string, element: T): void;
  patchElement<T extends DiagramElement>(category: string, id: string, patch: Partial<T>): void;
};

const defaultValue: DiagramInteractionValue = {
  diagram: null,
  keepElements: () => null,
  selectElements: () => [],
  mapElements: () => null,
  addElement: () => { },
  patchElement: () => { },
};

const useDiagramInteraction: (props: DiagramInteractionProps) => DiagramInteractionValue = () => {
  const { diagram, saveDiagram } = useDiagramPersistenceContext();

  const selectElements: SelectDiagramElementFn = useCallback((selectFn) => {
    if (!diagram) return [];

    return Object.entries(diagram.elements)
      .flatMap((entry) => entry[1].filter(selectFn));
  }, [diagram]);

  const mapElements = useCallback(async (mapFn: (e: DiagramElement) => DiagramElement): Promise<void> => {
    if (!diagram) return;

    await saveDiagram({
      ...diagram,
      elements: Object.entries(diagram.elements)
        .map((entry) => [entry[0], entry[1].map(mapFn)] as [string, DiagramElement[]])
        .reduce((map, [key, value]) => ({ ...map, [key]: value }), {})
    });
  }, [diagram, saveDiagram]);

  const keepElements = useCallback(async (filterFn: (e: DiagramElement) => boolean): Promise<void> => {
    if (!diagram) return;

    await saveDiagram({
      ...diagram,
      elements: Object.entries(diagram.elements)
        .map((entry) => [entry[0], entry[1].filter(filterFn)] as [string, DiagramElement[]])
        .reduce((map, [key, value]) => ({ ...map, [key]: value }), {})
    });
  }, [diagram, saveDiagram]);

  const addElement: AddDiagramElementFn = useCallback(async (category, element): Promise<void> => {
    if (!diagram) return;

    await saveDiagram({
      ...diagram,
      elements: {
        ...diagram.elements,
        [category]: diagram.elements[category] ? [...diagram.elements[category], element] : [element]
      }
    });
  }, [diagram, saveDiagram]);

  const patchElement = useCallback(async <T extends DiagramElement>(category: string, id: string, patch: Partial<T>): Promise<void> => {
    if (!diagram) return;

    await saveDiagram({
      ...diagram,
      elements: {
        ...diagram.elements,
        [category]: diagram.elements[category].map((element) => (element.id === id ? { ...element, ...patch } : element))
      }
    });
  }, [diagram, saveDiagram]);

  return useContextValueObject({ diagram, patchElement, addElement, keepElements, mapElements, selectElements }, defaultValue) as DiagramInteractionValue;
};

const hookBasedContext = createHookBasedContext(useDiagramInteraction, defaultValue);

export const DiagramInteractionProvider = hookBasedContext.Provider;
export const useDiagramInteractionContext = hookBasedContext.useContext;
