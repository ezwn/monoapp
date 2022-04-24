import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { createHookBasedContext } from '../../../lib/react-utils/createHookBasedContext';
import { useSelectionContext } from '../../../lib/Selection-ctx';
import { useDiagramUIContext } from '../shared/DiagramUI-ctx';
import { DiagramRect } from './Diagram-mdl';
import { useDiagramInteractionContext } from './DiagramInteraction-ctx';

export type DragProps = {
};

export type DragValue = {
  startDragging: () => void;
  onMouseMove: (event: MouseEvent) => void;
  stopDragging: () => boolean;
};

const defaultValue: DragValue = {
  startDragging: () => { },
  onMouseMove: () => { },
  stopDragging: () => false
};

const useDrag: (props: DragProps) => DragValue = () => {
  const { mode, setMode } = useDiagramUIContext();
  const { selection } = useSelectionContext();
  const { mapElements } = useDiagramInteractionContext();

  const [draggingDistance, setDraggingDistance] = useState<number>(0);
  const cumulMovementX = useRef<number>(0);
  const cumulMovementY = useRef<number>(0);

  const isDragging = mode === "DRAG" && selection.length > 0

  const startDragging = useCallback(() => {
    cumulMovementX.current = 0;
    cumulMovementY.current = 0;
    setMode('DRAG');
  }, [setMode]);

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (isDragging) {
      cumulMovementX.current += event.movementX;
      cumulMovementY.current += event.movementY;
    }
  }, [cumulMovementX, cumulMovementY, isDragging]);

  const flushMovement = useCallback(() => {
    const dX = cumulMovementX.current;
    const dY = cumulMovementY.current;
    cumulMovementX.current = 0;
    cumulMovementY.current = 0;

    if (dX !== 0 || dY !== 0) {
      mapElements((element) => {
        if (selection.includes(element.id)) {
          const rect = element as DiagramRect;
          const [left, top, width] = rect.userBounds;

          return {
            ...element,
            userBounds: [left + dX, top + dY, width]
          };
        }

        setDraggingDistance(draggingDistance + Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2)));

        return element;
      });
    }
  }, [cumulMovementX, cumulMovementY, selection, mapElements, draggingDistance]);

  useEffect(() => {
    const interval = isDragging ? setInterval(flushMovement, 50) : null;

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [flushMovement, isDragging]);

  const stopDragging = useCallback(() => {
    const hasDragged = mode === 'DRAG' && draggingDistance >= 2;
    setDraggingDistance(0);
    return hasDragged;
  }, [draggingDistance, mode]);

  return { startDragging, onMouseMove, stopDragging };
};

const hookBasedContext = createHookBasedContext(useDrag, defaultValue);

export const DiagramDragProvider = hookBasedContext.Provider;
export const useDiagramDragContext = hookBasedContext.useContext;
