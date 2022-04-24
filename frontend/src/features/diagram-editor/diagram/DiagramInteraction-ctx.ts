import { useCallback } from 'react';
import { createHookBasedContext } from '../../../lib/react-utils/createHookBasedContext';
import { Diagram, DiagramElement } from './Diagram-mdl';
import { useDiagramPersistenceContext } from './DiagramPersistence-ctx';

export type DiagramInteractionProps = {};

export type AddDiagramElementFn = <T extends DiagramElement>(category: string, element: T) => void;
export type SelectDiagramElementFn = (selectFn: (e: DiagramElement) => boolean) => DiagramElement[];

export type IDiagramInteractionValue = {
  diagram: Diagram | null;
  keepElements(filterFn: (e: DiagramElement) => boolean): void;
  selectElements(selectFn: (e: DiagramElement) => boolean): DiagramElement[];
  mapElements(mapFn: (e: DiagramElement) => DiagramElement): void;
  addElement<T extends DiagramElement>(category: string, element: T): void;
  patchElement<T extends DiagramElement>(category: string, id: string, patch: Partial<T>): void;
};

const defaultValue: IDiagramInteractionValue = {
  diagram: null,
  keepElements: () => null,
  selectElements: () => [],
  mapElements: () => null,
  addElement: () => { },
  patchElement: () => { },
};

const useDiagramInteraction: (props: DiagramInteractionProps) => IDiagramInteractionValue = () => {
  const { diagram, saveDiagram } = useDiagramPersistenceContext();

  const selectElements: SelectDiagramElementFn = useCallback((selectFn) => {
    if (!diagram) return [];

    return Object.entries(diagram.elements)
      .flatMap((entry) => entry[1].filter(selectFn));
  }, [diagram]);

  const mapElements = useCallback((mapFn: (e: DiagramElement) => DiagramElement): void => {
    if (!diagram) return;

    saveDiagram({
      ...diagram,
      elements: Object.entries(diagram.elements)
        .map((entry) => [entry[0], entry[1].map(mapFn)] as [string, DiagramElement[]])
        .reduce((map, [key, value]) => ({ ...map, [key]: value }), {})
    });
  }, [diagram, saveDiagram]);

  const keepElements = useCallback((filterFn: (e: DiagramElement) => boolean): void => {
    if (!diagram) return;

    saveDiagram({
      ...diagram,
      elements: Object.entries(diagram.elements)
        .map((entry) => [entry[0], entry[1].filter(filterFn)] as [string, DiagramElement[]])
        .reduce((map, [key, value]) => ({ ...map, [key]: value }), {})
    });
  }, [diagram, saveDiagram]);

  const addElement: AddDiagramElementFn = useCallback((category, element): void => {
    if (!diagram) return;

    saveDiagram({
      ...diagram,
      elements: {
        ...diagram.elements,
        [category]: diagram.elements[category] ? [...diagram.elements[category], element] : [element]
      }
    });
  }, [diagram, saveDiagram]);

  const patchElement = useCallback(<T extends DiagramElement>(category: string, id: string, patch: Partial<T>): void => {
    if (!diagram) return;

    saveDiagram({
      ...diagram,
      elements: {
        ...diagram.elements,
        [category]: diagram.elements[category].map((element) => (element.id === id ? { ...element, ...patch } : element))
      }
    });
  }, [diagram, saveDiagram]);

  return { diagram, patchElement, addElement, keepElements, mapElements, selectElements };
};

const hookBasedContext = createHookBasedContext(useDiagramInteraction, defaultValue);

export const DiagramInteractionProvider = hookBasedContext.Provider;
export const useDiagramInteractionContext = hookBasedContext.useContext;
