import React, { createRef, MouseEvent, useCallback, useEffect, useState } from 'react';

import { DiagramElement } from './Diagram-mdl';
import { useSelectionContext } from '../../../lib/Selection-ctx';
import { NoteCmp } from '../diagram-notes/Note-cmp';
import { useNavigatorPersistenceContext } from '../../../lib/file-browsing/NavigatorPersistence-ctx';
import { useDiagramUIContext } from '../shared/DiagramUI-ctx';
import { DiagramRelationCmp } from './elements/DiagramRelation-cmp';
import { useDiagramInteractionContext } from './DiagramInteraction-ctx';
import { useCommandDispatcherContext } from '../../../lib/commands/CommandDispatcher-ctx';
import { useDiagramDragContext } from './DiagramDrag-ctx';
import { usePointingContext } from '../shared/Pointing-ctx';

import './Diagram-cmp.css';

export const DiagramCmp: React.FC<{}> = () => {
  const [hasMouseDown, setHasMouseDown] = useState(false);
  const { diagram } = useDiagramInteractionContext();
  const { setSelection } = useSelectionContext();
  const myRef = createRef<HTMLDivElement>();
  const { mode, setMode } = useDiagramUIContext();
  const { setEnabled } = useCommandDispatcherContext();
  const { onMouseMove: onMouseDragMove } = useDiagramDragContext();
  const { setPointedLocation } = usePointingContext();

  useEffect(() => {
    setEnabled(mode !== "EDITION");
    return () => setEnabled(true);
  }, [mode, setEnabled]);

  const onMouseDown = useCallback(() => {
    setHasMouseDown(true);
  }, []);

  const onMouseUp = useCallback(() => {
    setHasMouseDown(false);
  }, []);

  const onClick = useCallback(() => {
    if (hasMouseDown) {
      setMode('DEFAULT');
      setSelection([]);
    }
    onMouseUp();
  }, [onMouseUp, hasMouseDown, setSelection, setMode]);

  const onMouseMove = useCallback((mouseEvent: MouseEvent) => {
    if (myRef.current) {
      if (onMouseDragMove) {
        onMouseDragMove(mouseEvent);
      }
      const boundingRect = myRef.current.getBoundingClientRect();
      setPointedLocation([mouseEvent.clientX - boundingRect.x, mouseEvent.clientY - boundingRect.y]);
    }

  }, [myRef, onMouseDragMove, setPointedLocation]);

  const { currentFile } = useNavigatorPersistenceContext();

  if (!currentFile || !diagram) {
    return null;
  }

  return (
    <div className="diagram" ref={myRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onClick={onClick}>
      <svg>
        {diagram.elements.relations && diagram.elements.relations.map((diagramElement: DiagramElement) => (
          <DiagramRelationCmp key={diagramElement.id} {...diagramElement} />
        ))}
      </svg>
      <div>
        {diagram.elements.notes.map((diagramElement: DiagramElement) => (
          <NoteCmp key={diagramElement.id} {...diagramElement} />
        ))}
      </div>
    </div>
  );
};
