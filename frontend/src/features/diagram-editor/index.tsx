import React, { ReactNode } from 'react';
import { FS4JFile, fileToTitle } from '../../lib/fs4webapp-client';
import { DiagramCmp } from './diagram/Diagram-cmp';
import { DiagramInteractionProvider } from './diagram/DiagramInteraction-ctx';
import { DiagramPersistenceProvider } from './diagram/DiagramPersistence-ctx';
import { NotePlugin } from './diagram-notes/NotePlugin';
import { DiagramPlugin } from './diagram/DiagramPlugin';
import { DiagramRelationInteractionProvider } from './diagram/elements/DiagramRelationInteraction-ctx';
import { DiagramUIProvider } from './shared/DiagramUI-ctx';
import { PointingContextProvider } from './shared/Pointing-ctx';
import { SelectionProvider } from '../../lib/Selection-ctx';
import { useNavigatorPersistenceContext } from '../../lib/file-browsing/NavigatorPersistence-ctx';
import { DiagramDragProvider } from './diagram/DiagramDrag-ctx';
import { FileLabelCmp } from '../../lib/file-browsing/FileLabel-cmp';

const extension = ".dia.json"

const mainView = () => <DiagramDragProvider>
  <DiagramCmp />
</DiagramDragProvider>;

const GlobalProvider: React.FC<{}> = ({ children }) => {

  const { currentFile } = useNavigatorPersistenceContext();

  if (!currentFile) {
    return <>{children}</>;
  }

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

const extractTitle = fileToTitle(extension);

const fileLabelCmp: React.FC<{ file: FS4JFile }> = ({ file }) =>
  <FileLabelCmp fileTitle={extractTitle(file)} />;

export const fileConfigFor = (file: FS4JFile) => file.name.endsWith(extension) ? {
  tabTitle: extractTitle,
  fileLabelCmp,
  closable: false,
  mainView,
  withGlobalProvider: (jsx: ReactNode) => <GlobalProvider>{jsx}</GlobalProvider>
} : null;
