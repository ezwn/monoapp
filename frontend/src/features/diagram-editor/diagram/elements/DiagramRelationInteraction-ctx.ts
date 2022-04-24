import { createHookBasedContext } from "../../../../lib/react-utils/createHookBasedContext";
import { generateRandomTextId } from "../../../../lib/js-utils/generateRandomTextId";
import { usePointingContext } from "../../shared/Pointing-ctx";
import { useSelectionContext } from "../../../../lib/Selection-ctx";
import { DiagramElement, DiagramRelation, instanceOfDiagramRelation } from "../Diagram-mdl";
import { useDiagramInteractionContext } from "../DiagramInteraction-ctx";
import { useCallback } from "react";

export type DiagramRelationInteractionProps = {};

export type IDiagramRelationInteractionValue = {

  createRelation: () => boolean;

  selectRelation: () => void;
};

const defaultValue: IDiagramRelationInteractionValue = {
  createRelation: () => true,
  selectRelation: () => undefined,
};

const filterRelationContainsEndById = (endId: string) => (element: DiagramElement) => {
  if (!instanceOfDiagramRelation(element)) {
    return false;
  }

  const relation = element as DiagramRelation;
  return relation.ends.some(end => end.id === endId);
}

const useDiagramRelationInteraction: (props: DiagramRelationInteractionProps) => IDiagramRelationInteractionValue = () => {

  const { selection } = useSelectionContext();
  const { pointedElement, setPointedElement } = usePointingContext();
  const { addElement, selectElements } = useDiagramInteractionContext();

  const createRelation = useCallback((): boolean => {
    if (selection.length < 2)
      return false;

    const id = 'RELATION-' + generateRandomTextId(8);
    addElement('relations', {
      id,
      attachPointNumber: 99,
      shape: 'CENTROID',
      ends: selection.map(elementId => ({ id: generateRandomTextId(8), target: elementId }))
    });

    return true;
  }, [selection, addElement]);

  const selectRelation = useCallback(() => {
    if (pointedElement) {
      const relations = selectElements(filterRelationContainsEndById(pointedElement));
      if (relations.length === 1) {
        setPointedElement(relations[0].id);
        return;
      }
    }
  }, [pointedElement, selectElements, setPointedElement]);

  return { createRelation, selectRelation };
};

const hookBasedContext = createHookBasedContext(useDiagramRelationInteraction, defaultValue);

export const DiagramRelationInteractionProvider = hookBasedContext.Provider;
export const useDiagramRelationInteractionContext = hookBasedContext.useContext;
