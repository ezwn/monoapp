import { useCallback, useEffect, useState } from 'react';
import { FS4JFile, ls, parentPath } from '../fs4webapp-client';
import { createHookBasedContext } from '../react-utils/createHookBasedContext';

export type NavigatorPersistenceProps = {};

export type NavigatorPersistenceValue = {
  files: FS4JFile[];
  currentPath: string,
  currentFile: FS4JFile | null;
  setTarget: (target: FS4JFile) => void;
  gotoParentPath: () => void;
  closeCurrentFile: () => void;
};

const defaultValue: NavigatorPersistenceValue = {
  files: [],
  currentFile: null,
  setTarget: () => { },
  currentPath: "",
  gotoParentPath: () => { },
  closeCurrentFile: () => { },
};

const useNavigatorPersistence: (props: NavigatorPersistenceProps) => NavigatorPersistenceValue = () => {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [currentFile, setCurrentFile] = useState<FS4JFile | null>(defaultValue.currentFile);
  const [files, setFiles] = useState<FS4JFile[]>(defaultValue.files);

  useEffect(() => {
    async function fetch() {
      const newFiles = await ls(currentPath);
      if (JSON.stringify(newFiles)!==JSON.stringify(files)) {
        setFiles(newFiles);
      }
    }

    fetch();

    const interval = setInterval(fetch, 2000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };

  }, [currentPath, files]);

  const setTarget = useCallback((target: FS4JFile) => {
    if (target.isDirectory) {
      setCurrentPath(target.path);
    }
    setCurrentFile(target);
  }, []);

  const gotoParentPath = useCallback(() => {
    const newPath = parentPath(currentPath);
    setCurrentPath(newPath);
    setCurrentFile({
      name: newPath,
      path: newPath,
      isDirectory: true
    });
  }, [currentPath]);

  const closeCurrentFile = useCallback(() => {
    setCurrentFile({
      name: currentPath,
      path: currentPath,
      isDirectory: true
    });
  }, [currentPath]);

  return { files, currentFile, currentPath, setTarget, gotoParentPath, closeCurrentFile };
};

const hookBasedContext = createHookBasedContext(useNavigatorPersistence, defaultValue);

export const NavigatorPersistenceProvider = hookBasedContext.Provider;
export const useNavigatorPersistenceContext = hookBasedContext.useContext;
