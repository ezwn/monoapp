import React, { useCallback, useEffect, useState } from 'react';
import { DynamicFileLabel } from '../../lib/file-browsing/DynamicFileLabel-cmp';
import { TableCmp, Row } from '../../lib/ui-components/Table-cmp';
import { useNavigatorPersistenceContext } from '../../lib/file-browsing/NavigatorPersistence-ctx';

import './FolderBrowser-cmp.css';
import { FileUploadArea } from '../../lib/fs4webapp-client/FileUploadArea';

export type FolderBrowserProps = {};

export const FolderBrowserCmp: React.FC<FolderBrowserProps> = () => {
  const { files, setTarget, currentFile, currentPath, gotoParentPath } = useNavigatorPersistenceContext();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let rows = currentPath ? [{
      value: "UP",
      label: <>..</>
    }] : [];


    rows = [
      ...rows,
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

    setRows(rows);
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
    <>
      <TableCmp
        items={rows}
        selectedItemValue={currentFile?.path || null}
        onClick={onClick}
      />
      <FileUploadArea path={currentPath} />
    </>
  );
};
