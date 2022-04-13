import React, { createRef, MouseEvent, useCallback, useEffect, WheelEvent } from 'react';

import { useSelectionContext } from '../../../../lib/Selection-ctx';
import { useDiagramInteractionContext } from '../DiagramInteraction-ctx';

import { usePointingContext } from '../../shared/Pointing-ctx';
import classNames from 'classnames';

import { DiagramRect } from '../Diagram-mdl';

import { useDiagramUIContext } from '../../shared/DiagramUI-ctx';

import './DiagramRect-cmp.css';
import { stopEvent } from '../../../../lib/ui-components/stopEvent';

export const DiagramRectCmp: React.FC<DiagramRect> = ({ children, userBounds: [left, top, width], id, bounds }) => {
  const { setSelection, selection } = useSelectionContext();
  const { setPointedElement, pointedElement } = usePointingContext();
  const { patchElement } = useDiagramInteractionContext();
  const { mode, setMode } = useDiagramUIContext();

  const mainDiv = createRef<HTMLDivElement>();
  const selected = selection.indexOf(id) !== -1;
  const edition = selected && mode === 'EDITION';

  useEffect(() => {
    if (!edition && mainDiv.current) {
      const { width: measuredWidth, height: measuredHeight } = mainDiv.current.getBoundingClientRect();

      if (!bounds || bounds[0] !== left
        || bounds[1] !== top || bounds[2] !== measuredWidth
        || bounds[3] !== measuredHeight) {

        patchElement<DiagramRect>('notes', id, { bounds: [left, top, measuredWidth, measuredHeight] });

      }
    }
  }, [edition, mainDiv, bounds, patchElement, id, left, top]);

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
    event.stopPropagation();
    event.preventDefault();

    if (!selected)
      setSelection(event.ctrlKey ? [...selection, id] : [id]);

    setMode('DRAG');
  }, [selected, setSelection, setMode, id, selection]);

  const onMouseUp = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    setMode(event.ctrlKey ? 'DEFAULT' : 'EDITION');
  }, [setMode]);

  return (
    <div
      ref={mainDiv}
      onWheel={onWheel}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={classNames({ floating: true, rect: true, pointed: id === pointedElement, selected })}
      style={{
        left,
        top,
        width,
        minHeight: edition ? bounds && bounds[3] : undefined,
        minWidth: !width && edition ? bounds && bounds[2] : undefined
      }}
      onMouseDown={edition ? undefined : onMouseDown}
      onMouseUp={edition ? undefined : onMouseUp}
      onClick={stopEvent}
    >
      {children}
    </div>
  );
};
