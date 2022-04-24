import React, { ReactNode } from 'react';
import { File } from '../../lib/fs4webapp-client';
import { DiagramCmp } from './diagram/Diagram-cmp';
import { DiagramInteractionProvider } from './diagram/DiagramInteraction-ctx';
import { DiagramPersistenceProvider } from './diagram/DiagramPersistence-ctx';
import { NotePlugin } from './diagram-notes/NotePlugin';
import { DiagramPlugin } from './diagram/DiagramPlugin';
import { DiagramRelationInteractionProvider } from './diagram/elements/DiagramRelationInteraction-ctx';
import { DiagramUIProvider } from './shared/DiagramUI-ctx';
import { PointingContextProvider } from './shared/Pointing-ctx';
import { SelectionProvider } from '../../lib/Selection-ctx';
import { useNavigatorPersistenceContext } from '../navigator/NavigatorPersistence-ctx';
import { DiagramDragProvider } from './diagram/DiagramDrag-ctx';

const extension = ".dia.json"

const mainView = () => <DiagramDragProvider>
  <DiagramCmp />
</DiagramDragProvider>;

const GlobalProvider: React.FC<{}> = ({ children }) => {

  const { currentFile } = useNavigatorPersistenceContext();

  if (!currentFile)
    return <>{children}</>;

  return <DiagramUIProvider>
    <SelectionProvider>
      <PointingContextProvider>
        <DiagramPersistenceProvider diagramId={currentFile.path}>
          <DiagramInteractionProvider>
            <DiagramRelationInteractionProvider>
              <DiagramPlugin>
                <NotePlugin>
                  {children}
                </NotePlugin>
              </DiagramPlugin>
            </DiagramRelationInteractionProvider>
          </DiagramInteractionProvider>
        </DiagramPersistenceProvider>
      </PointingContextProvider>
    </SelectionProvider>
  </DiagramUIProvider>;
};

const fileLabel: React.FC<{ file: File }> = ({ file }) => <>
  {file.name.substring(0, file.name.length - extension.length)}
</>;

export const fileConfigFor = (file: File) => file.name.endsWith(extension) ? {
  fileLabel,
  mainView,
  withGlobalProvider: (jsx: ReactNode) => <GlobalProvider>{jsx}</GlobalProvider>
} : null;
