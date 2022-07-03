import { createHookBasedContext, useContextValueObject } from "../../../../lib/react-utils/createHookBasedContext";
import { generateRandomTextId } from "../../../../lib/js-utils/generateRandomTextId";
import { usePointingContext } from "../../shared/Pointing-ctx";
import { useSelectionContext } from "../../../../lib/Selection-ctx";
import { DiagramElement, DiagramRelation, instanceOfDiagramRelation } from "../Diagram-mdl";
import { useDiagramInteractionContext } from "../DiagramInteraction-ctx";
import { useCallback } from "react";

export type DiagramRelationInteractionProps = {};

export type DiagramRelationInteractionValue = {

  createRelation: () => Promise<boolean>;

  selectRelation: () => void;
};

const defaultValue: DiagramRelationInteractionValue = {
  createRelation: () => Promise.resolve(true),
  selectRelation: () => undefined,
};

const filterRelationContainsEndById = (endId: string) => (element: DiagramElement) => {
  if (!instanceOfDiagramRelation(element)) {
    return false;
  }

  const relation = element as DiagramRelation;
  return relation.ends.some(end => end.id === endId);
}

const useDiagramRelationInteraction: (props: DiagramRelationInteractionProps) => DiagramRelationInteractionValue = () => {

  const { selection } = useSelectionContext();
  const { pointedElement, setPointedElement } = usePointingContext();
  const { addElement, selectElements } = useDiagramInteractionContext();

  const createRelation = useCallback(async (): Promise<boolean> => {
    if (selection.length < 2)
      return false;

    const id = 'RELATION-' + generateRandomTextId(8);
    await addElement('relations', {
      id,
      attachPointNumber: 99,
      shape: 'CENTROID',
      ends: selection.map(elementId => ({ id: generateRandomTextId(8), target: elementId }))
    });

    return true;
  }, [selection, addElement]);

  const selectRelation = useCallback((): void => {
    if (pointedElement) {
      const relations = selectElements(filterRelationContainsEndById(pointedElement));
      if (relations.length === 1) {
        setPointedElement(relations[0].id);
        return;
      }
    }
  }, [pointedElement, selectElements, setPointedElement]);

  return useContextValueObject({ createRelation, selectRelation }, defaultValue) as DiagramRelationInteractionValue;
};

const hookBasedContext = createHookBasedContext(useDiagramRelationInteraction, defaultValue);

export const DiagramRelationInteractionProvider = hookBasedContext.Provider;
export const useDiagramRelationInteractionContext = hookBasedContext.useContext;
