import React from 'react';
import { DiagramElement, DiagramRect, DiagramText } from '../diagram/Diagram-mdl';
import { DiagramRectCmp } from '../diagram/elements/DiagramRect-cmp';
import { DiagramTextCmp } from '../diagram/elements/DiagramText-cmp';

export const NoteCmp: React.FC<DiagramElement> = (props) => {
  return (
    <DiagramRectCmp {...(props as DiagramRect)}>
      <DiagramTextCmp {...(props as DiagramText)} />
    </DiagramRectCmp>
  );
};
