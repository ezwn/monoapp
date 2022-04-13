import React from 'react';
import { useAppCoreContext } from '../../lib/app-core/AppCore-ctx';
import { File } from '../../lib/fs4webapp-client';
import { MenuCmp } from '../../lib/ui-components/Menu-cmp';

import { useNavigatorPersistenceContext } from './NavigatorPersistence-ctx';

export type DiagramProps = {};

const FileLabel: React.FC<{ file: File }> = ({ file }) => {

  const { findFileTypeSettings } = useAppCoreContext();

  const setting = findFileTypeSettings(file);

  return <>{setting ? <setting.fileLabel file={file} /> : <>{file.name}</>}</>;
}

export const NavigatorCmp: React.FC<DiagramProps> = () => {
  const { files, setTarget, currentFile, currentPath, gotoParentPath } = useNavigatorPersistenceContext();

  let items = files.map(
    file => ({
      value: file.path,
      label: <FileLabel file={file} />
    })
  );

  if (currentPath) {
    items = [{
      value: "UP",
      label: <>..</>
    }, ...items];
  }

  const onClick = (selectedPath: string) => {

    if (selectedPath === "UP") {
      gotoParentPath();
    } else {
      setTarget(
        files.find(file => file.path === selectedPath)!
      )
    }
  }

  return (
    <MenuCmp
      items={items}
      selectedItemValue={currentFile?.path || null}
      onClick={onClick}
    />
  );
};
