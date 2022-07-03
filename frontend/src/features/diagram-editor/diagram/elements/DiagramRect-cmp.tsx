import React, { createRef, MouseEvent, useCallback, useEffect, WheelEvent } from 'react';
import classNames from 'classnames';
import { pushStateLongDebounced } from '../../../../lib/git';
import { stopEvent } from '../../../../lib/ui-components/stopEvent';
import { useNavigatorPersistenceContext } from '../../../../lib/file-browsing/NavigatorPersistence-ctx';

import { useSelectionContext } from '../../../../lib/Selection-ctx';
import { useDiagramInteractionContext } from '../DiagramInteraction-ctx';
import { usePointingContext } from '../../shared/Pointing-ctx';
import { useDiagramUIContext } from '../../shared/DiagramUI-ctx';
import { useDiagramDragContext } from '../DiagramDrag-ctx';

import { DiagramRect } from '../Diagram-mdl';

import './DiagramRect-cmp.css';

export const DiagramRectCmp: React.FC<DiagramRect> = ({ children, userBounds: [left, top, width], id, bounds }) => {
  const { setSelection, selection } = useSelectionContext();
  const { setPointedElement, pointedElement } = usePointingContext();
  const { patchElement } = useDiagramInteractionContext();
  const { mode, setMode } = useDiagramUIContext();
  const { startDragging, stopDragging } = useDiagramDragContext();
  const { currentFile } = useNavigatorPersistenceContext();

  const mainDiv = createRef<HTMLDivElement>();
  const isSelected = selection.indexOf(id) !== -1;
  const isEdited = isSelected && mode === 'EDITION';

  useEffect(() => {
    if (!isEdited && mainDiv.current) {
      const { width: measuredWidth, height: measuredHeight } = mainDiv.current.getBoundingClientRect();
      const roundedWidth = Math.round(measuredWidth);
      const roundedHeight = Math.round(measuredHeight);

      if (!bounds || bounds[0] !== left
        || bounds[1] !== top || bounds[2] !== roundedWidth
        || bounds[3] !== roundedHeight) {
        patchElement<DiagramRect>('notes', id, { bounds: [left, top, roundedWidth, roundedHeight] });
      }
    }
  }, [isEdited, mainDiv, bounds, patchElement, id, left, top]);

  const onMouseEnter = useCallback(() => {
    setPointedElement(id);
  }, [setPointedElement, id]);

  const onMouseLeave = useCallback(() => {
    setPointedElement(null);
  }, [setPointedElement]);

  const onWheel = useCallback(async (event: WheelEvent) => {
    event.stopPropagation();

    if (mainDiv.current) {
      const currentWidth = width || mainDiv.current.getBoundingClientRect().width;
      const deltaY = event.deltaY;
      await patchElement<DiagramRect>('notes', id, { userBounds: [left, top, currentWidth - Math.round(deltaY / 10)] });

      pushStateLongDebounced(currentFile, "Resize rectangle");
    }
  }, [mainDiv, id, left, top, width, patchElement, currentFile]);

  const onMouseDown = useCallback((event: MouseEvent) => {
    stopEvent(event);

    if (!isSelected)
      setSelection(event.ctrlKey ? [...selection, id] : [id]);

    if (!event.ctrlKey) {
      startDragging();
    }
  }, [isSelected, setSelection, startDragging, id, selection]);

  const onMouseUp = useCallback((event: MouseEvent) => {
    stopEvent(event);

    if (stopDragging && mode === 'DRAG') {
      const hasDragged = stopDragging();
      setMode(hasDragged || selection.length!==1 ? 'DEFAULT' : 'EDITION');
    }
  }, [stopDragging, setMode, mode, selection]);

  return (
    <div
      ref={mainDiv}
      onWheel={onWheel}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={isEdited ? undefined : onMouseDown}
      onMouseUp={isEdited ? undefined : onMouseUp}
      onClick={stopEvent}
      className={classNames({ floating: true, rect: true, pointed: id === pointedElement, selected: isSelected })}
      style={{
        left,
        top,
        width,
        minHeight: isEdited ? bounds && bounds[3] : undefined,
        minWidth: !width && isEdited ? bounds && bounds[2] : undefined
      }}
    >
      {children}
    </div>
  );
};
