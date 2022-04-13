import React, { createRef, MouseEvent, useCallback, useState } from 'react';

import { DiagramInteractionProvider, useDiagramInteractionContext } from './DiagramInteraction-ctx';
import { DiagramPersistenceProvider } from './DiagramPersistence-ctx';
import { DiagramElement } from './Diagram-mdl';
import { useSelectionContext } from '../../../lib/Selection-ctx';
import { NoteCmp } from '../diagram-notes/Note-cmp';
import { NotePlugin } from '../diagram-notes/NotePlugin';
import { usePointingContext } from '../shared/Pointing-ctx';
import { useNavigatorPersistenceContext } from '../../navigator/NavigatorPersistence-ctx';
import { useDiagramUIContext } from '../shared/DiagramUI-ctx';
import { DiagramPlugin } from './DiagramPlugin';
import { DiagramRelationCmp } from './elements/DiagramRelation-cmp';
import { DiagramRelationInteractionProvider } from './elements/DiagramRelationInteraction-ctx';
import { KeyboardCommandOutputCmp } from '../shared/commands/KeyboardCommandOutput-cmp';
import { DiagramUIProvider } from '../shared/DiagramUI-ctx';
import { KeyCommandDispatcherProvider } from '../shared/commands/KeyboardCommandDispatcher-ctx';
import { PointingContextProvider } from '../shared/Pointing-ctx';
import { SelectionProvider } from '../../../lib/Selection-ctx';

import './Diagram-cmp.css';

export type DiagramProps = {};

export const DiagramCmp: React.FC<DiagramProps> = () => {
  const { currentFile } = useNavigatorPersistenceContext();

  if (!currentFile)
    return null;

  return (
    <DiagramUIProvider>
      <SelectionProvider>
        <PointingContextProvider>
          <DiagramPersistenceProvider diagramId={currentFile.path}>
            <DiagramInteractionProvider>
              <DiagramRelationInteractionProvider>
                <DiagramPlugin>
                  <NotePlugin>
                    <KeyCommandDispatcherProvider>
                      <ContextualizedDiagram />
                      <KeyboardCommandOutputCmp />
                    </KeyCommandDispatcherProvider>
                  </NotePlugin>
                </DiagramPlugin>
              </DiagramRelationInteractionProvider>
            </DiagramInteractionProvider>
          </DiagramPersistenceProvider>
        </PointingContextProvider>
      </SelectionProvider>
    </DiagramUIProvider>
  );
};

const ContextualizedDiagram: React.FC<{}> = () => {
  const [hasMouseDown, setHasMouseDown] = useState(false);
  const { diagram } = useDiagramInteractionContext();
  const { setSelection } = useSelectionContext();
  const { setPointedLocation } = usePointingContext();
  const { setMode } = useDiagramUIContext();
  const myRef = createRef<HTMLDivElement>();

  const clearSelection = useCallback(() => {
    if (hasMouseDown) {
      setMode('DEFAULT');
      setSelection([]);
    }
    setHasMouseDown(false);
  }, [hasMouseDown, setSelection, setMode]);

  const onMouseDown = () => {
    setHasMouseDown(true);
  }

  const onMouseMove = (mouseEvent: MouseEvent) => {
    if (myRef.current) {
      const boumdingRect = myRef.current.getBoundingClientRect();

      setPointedLocation([
        mouseEvent.clientX - boumdingRect.x,
        mouseEvent.clientY - boumdingRect.y,
        mouseEvent.movementX,
        mouseEvent.movementY
      ]);
    }
  };

  return (
    diagram && (
      <div className="diagram" ref={myRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onClick={clearSelection}>
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
    )
  );
};
