import React, { ChangeEvent, FocusEvent, SyntheticEvent, useCallback } from 'react';

import { useSelectionContext } from '../../../../lib/Selection-ctx';
import { useDiagramInteractionContext } from '../DiagramInteraction-ctx';

import { DiagramText } from '../Diagram-mdl';

import { useDiagramUIContext } from '../../shared/DiagramUI-ctx';

import './DiagramText-cmp.css';

export const DiagramTextCmp: React.FC<DiagramText> = (props) => {
  const { content, id, fontSize } = props as DiagramText;
  const { selection } = useSelectionContext();
  const { patchElement } = useDiagramInteractionContext();
  const { mode } = useDiagramUIContext();

  const isEdited = selection.indexOf(id) !== -1 && mode === 'EDITION';

  const patchContent = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void =>
    {
      event.stopPropagation();
      event.preventDefault();
      patchElement<DiagramText>('notes', id, { content: event.target.value })
    }, [patchElement, id]);

  const onFocus = (event: FocusEvent<HTMLTextAreaElement>) => {
    setTimeout(() => {
      event.target.select();
    }, 150);
  };

  const stopEventOnEdition = (event: SyntheticEvent) => {
    if (isEdited)
      event.stopPropagation();
  }

  return (
    <div className="text"
      onMouseDown={stopEventOnEdition}
      onMouseUp={stopEventOnEdition}
      onClick={stopEventOnEdition}>
      {isEdited && (
        <textarea
          value={content}
          onChange={patchContent}
          onFocus={onFocus}
          onMouseDown={stopEventOnEdition}
          onMouseUp={stopEventOnEdition}
          onClick={stopEventOnEdition}
          autoFocus={true}
          style={{ fontSize }}
        />
      )}
      {isEdited ? <EditionContentCmp {...props} /> : <ContentCmp {...props} />}
    </div>
  );
};

const EditionContentCmp: React.FC<DiagramText> = (props) => {
  const { content, fontSize } = props as DiagramText;
  return <div className="edition-content" style={{ fontSize }}>
    {content}
    {content.endsWith('\n') && <>&nbsp;</>}
  </div>;
};

const ContentCmp: React.FC<DiagramText> = (props) => {
  const { content, fontSize } = props as DiagramText;
  return <div className="content" style={{ fontSize }}>
    {content.split("\n")
      .map(parseLine)
      .map(([line, className], i) => <div key={`line-${i}`} className={className}>{line}</div>)}
  </div>;
};

const parseLine = (line: string): [string, string?] => {
  if (line.startsWith("# ")) {
    return [line.substr(2), "t1"];
  }

  if (line.startsWith("## ")) {
    return [line.substr(3), "t2"];
  }

  if (line.startsWith("### ")) {
    return [line.substr(4), "t3"];
  }

  if (line.startsWith("! ")) {
    return [line.substr(2), "warning"];
  }

  if (line.startsWith("< ")) {
    return [line.substr(2), "left"];
  }

  if (line.startsWith("--")) {
    return ["", "hr"];
  }

  return [line, "line"];
}
