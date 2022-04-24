import React, { createRef, MouseEvent, useCallback, useEffect, WheelEvent } from 'react';

import { useSelectionContext } from '../../../../lib/Selection-ctx';
import { useDiagramInteractionContext } from '../DiagramInteraction-ctx';

import { usePointingContext } from '../../shared/Pointing-ctx';
import classNames from 'classnames';

import { DiagramRect } from '../Diagram-mdl';

import { useDiagramUIContext } from '../../shared/DiagramUI-ctx';

import './DiagramRect-cmp.css';
import { stopEvent } from '../../../../lib/ui-components/stopEvent';
import { useDiagramDragContext } from '../DiagramDrag-ctx';

export const DiagramRectCmp: React.FC<DiagramRect> = ({ children, userBounds: [left, top, width], id, bounds }) => {
  const { setSelection, selection } = useSelectionContext();
  const { setPointedElement, pointedElement } = usePointingContext();
  const { patchElement } = useDiagramInteractionContext();
  const { mode, setMode } = useDiagramUIContext();
  const { startDragging, stopDragging } = useDiagramDragContext();
  const mainDiv = createRef<HTMLDivElement>();
  const isSelected = selection.indexOf(id) !== -1;
  const isEdited = isSelected && mode === 'EDITION';

  useEffect(() => {
    if (!isEdited && mainDiv.current) {
      const { width: measuredWidth, height: measuredHeight } = mainDiv.current.getBoundingClientRect();

      if (!bounds || bounds[0] !== left
        || bounds[1] !== top || bounds[2] !== measuredWidth
        || bounds[3] !== measuredHeight) {

        patchElement<DiagramRect>('notes', id, { bounds: [left, top, measuredWidth, measuredHeight] });

      }
    }
  }, [isEdited, mainDiv, bounds, patchElement, id, left, top]);

  const onMouseEnter = () => {
    setPointedElement(id);
  };

  const onMouseLeave = () => {
    setPointedElement(null);
  };

  const onWheel = useCallback((event: WheelEvent) => {
    event.stopPropagation();

    if (mainDiv.current) {
      const currentWidth = width || mainDiv.current.getBoundingClientRect().width;
      const deltaY = event.deltaY;
      patchElement<DiagramRect>('notes', id, { userBounds: [left, top, currentWidth - Math.round(deltaY / 10)] });
    }
  }, [mainDiv, id, left, top, width, patchElement]);

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

    if (mode === 'DRAG') {
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
