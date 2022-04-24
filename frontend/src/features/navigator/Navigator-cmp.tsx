import React, { useCallback, useEffect, useState } from 'react';
import { useFeatureListContext } from '../../lib/app-core/FeatureList-ctx';
import { FileTypeConfig } from '../../lib/app-core/FileBasedFeature';
import { File } from '../../lib/fs4webapp-client';
import { MenuCmp, MenuItem } from '../../lib/ui-components/Menu-cmp';

import { useNavigatorPersistenceContext } from './NavigatorPersistence-ctx';

export type DiagramProps = {};

const FileLabel: React.FC<{ file: File }> = ({ file }) => {
  const { findFileFeature } = useFeatureListContext();
  const [fileConfig, setFileConfig] = useState<FileTypeConfig | null>(null);

  useEffect(() => {
    setFileConfig(findFileFeature(file)?.fileConfigFor(file) || null);
  }, [findFileFeature, file]);

  return <>{fileConfig ? <fileConfig.fileLabel file={file} /> : <>{file.name}</>}</>;
}

export const NavigatorCmp: React.FC<DiagramProps> = () => {
  const { files, setTarget, currentFile, currentPath, gotoParentPath } = useNavigatorPersistenceContext();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
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

    setMenuItems(items);
  }, [files, currentPath]);

  const onClick = useCallback((selectedPath: string) => {

    if (selectedPath === "UP") {
      gotoParentPath();
    } else {
      setTarget(
        files.find(file => file.path === selectedPath)!
      )
    }
  }, [files, setTarget, gotoParentPath]);

  return (
    <MenuCmp
      items={menuItems}
      selectedItemValue={currentFile?.path || null}
      onClick={onClick}
    />
  );
};
