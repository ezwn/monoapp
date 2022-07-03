import React, { ChangeEvent, FocusEvent, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { useSelectionContext } from '../../../../lib/Selection-ctx';
import { useDiagramInteractionContext } from '../DiagramInteraction-ctx';

import { DiagramText } from '../Diagram-mdl';

import { useDiagramUIContext } from '../../shared/DiagramUI-ctx';

import './DiagramText-cmp.css';
import { pushState } from '../../../../lib/git';
import { useNavigatorPersistenceContext } from '../../../../lib/file-browsing/NavigatorPersistence-ctx';

export const DiagramTextCmp: React.FC<DiagramText> = (props) => {
  const { content, id } = props as DiagramText;
  const { selection } = useSelectionContext();
  const { patchElement } = useDiagramInteractionContext();
  const { mode } = useDiagramUIContext();
  const { currentFile } = useNavigatorPersistenceContext();

  const isEdited = selection.indexOf(id) !== -1 && mode === 'EDITION';

  const onContentChanged = useCallback(async (value: string) => {
    await patchElement<DiagramText>('notes', id, { content: value })
    pushState(currentFile, "Change note content");
  }, [patchElement, id, currentFile]);

  const stopEventOnEdition = useCallback((event: SyntheticEvent) => {
    if (isEdited)
      event.stopPropagation();
  }, [isEdited]);

  return (
    <div className="text"
      onMouseDown={stopEventOnEdition}
      onMouseUp={stopEventOnEdition}
      onClick={stopEventOnEdition}>
      {isEdited ? <TextareaCmp
        initialValue={content}
        onChangeValidated={onContentChanged}
        /> : <ContentCmp {...props} />}
    </div>
  );
};

interface TextareaCmpProps {
  initialValue: string;
  onChangeValidated: (value: string) => any;
};

const TextareaCmp: React.FC<TextareaCmpProps> = ({ initialValue, onChangeValidated }) => {

  const [value, setValue] = useState(initialValue);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>): void => setValue(event.target.value),
    []
  );

  const onBlur = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>): void => {
      event.stopPropagation();
      event.preventDefault();

      if (value !== initialValue) {
        onChangeValidated(value);
      }
    },
    [onChangeValidated, value, initialValue]
  );

  const stopEventOnEdition = useCallback((event: SyntheticEvent) => {
    event.stopPropagation();
  }, []);


  const onFocus = useCallback((event: FocusEvent<HTMLTextAreaElement>) => {
    setTimeout(() => {
      event.target.select();
    }, 150);
  }, []);

  return <textarea
    className='rect'
    value={value}
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
    onMouseDown={stopEventOnEdition}
    onMouseUp={stopEventOnEdition}
    onClick={stopEventOnEdition}
    autoFocus={true}
  />;
};


const ContentInnerCmp: React.FC<DiagramText> = (props) => {
  const { content, fontSize } = props as DiagramText;
  const [mdContent, setMdContent] = useState<string | null>(null);
  const [className, setClassName] = useState<string>("");

  useEffect(() => {
    const allLines = content.split("\n");

    const headers: { [key: string]: string } = { align: "center" };
    let lines: string[];
    if (allLines[0].toLowerCase() === "<< headers >>") {
      let i = 1;
      while (i < allLines.length && allLines[i] !== "") {
        const [key, val] = allLines[i].split(": ");
        headers[key] = val;
        i++;
      }
      i++;

      lines = allLines.slice(i);
    } else {
      lines = allLines;
    }

    if (headers["align"] === "left") {
      setClassName(" left");
    }

    const autoBrLine = (line: string) => !line.startsWith("--") && !line.startsWith("- ") && !line.startsWith("* ") && line.trim() !== "";

    const updatedContent = lines
      .map((line, i) => {
        const lastLine = i === lines.length - 1;

        if (line.startsWith("! ")) return "### **" + line.substring("! ".length) + "**";
        if (line.startsWith("# ")) return line;
        if (line.startsWith("## ")) return line;
        if (line.startsWith("### ")) return line;

        if (line.startsWith("--")) return "\n---\n";

        if (lastLine || !autoBrLine(lines[i + 1])) {
          return line;
        } else {
          return line + "\\";
        }
      })
      .join("\n");

    setMdContent(updatedContent);
  }, [content])

  return <div className={"content" + className} style={{ fontSize }}>
    {mdContent && <ReactMarkdown>
      {mdContent}
    </ReactMarkdown>}
  </div>;
};

const ContentCmp = React.memo(ContentInnerCmp);
