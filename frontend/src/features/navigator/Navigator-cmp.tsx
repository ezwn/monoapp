import React, { useCallback, useEffect, useState } from 'react';
import { DynamicFileLabel } from '../../lib/file-browsing/DynamicFileLabel-cmp';
import { MenuCmp, MenuItem } from '../../lib/ui-components/Menu-cmp';
import { useNavigatorPersistenceContext } from '../../lib/file-browsing/NavigatorPersistence-ctx';

export type NavigatorCmpProps = {};

export const NavigatorCmp: React.FC<NavigatorCmpProps> = () => {
  const { files, setTarget, currentFile, currentPath, gotoParentPath } = useNavigatorPersistenceContext();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const directoriesOnly = false;

  useEffect(() => {
    let items = currentPath ? [{
      value: "UP",
      label: <>..</>
    }] : [];


    items = [
      ...items,
      ...files.filter(file => file.isDirectory).map(
        file => ({
          value: file.path,
          label: <DynamicFileLabel file={file} />
        })
      ), ...files.filter(file => !file.isDirectory).map(
        file => ({
          value: file.path,
          label: <DynamicFileLabel file={file} />
        })
      )];


    setMenuItems(items);
  }, [files, currentPath, directoriesOnly]);

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
