import { useCallback, useEffect, useState } from 'react';
import { File, ls } from '../../lib/fs4webapp-client';
import { createHookBasedContext } from '../../lib/react-utils/createHookBasedContext';

export type NavigatorPersistenceProps = {};

export type NavigatorPersistenceValue = {
  files: File[];
  currentPath: string,
  currentFile: File | null;
  setTarget: (target: File) => void;
  gotoParentPath: () => void;
};

const defaultValue: NavigatorPersistenceValue = {
  files: [],
  currentFile: null,
  setTarget: () => { },
  currentPath: "",
  gotoParentPath: () => { },
};

const useNavigatorPersistence: (props: NavigatorPersistenceProps) => NavigatorPersistenceValue = () => {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [currentFile, setCurrentFile] = useState<File | null>(defaultValue.currentFile);
  const [files, setFiles] = useState<File[]>(defaultValue.files);

  useEffect(() => {
    async function fetch() {
      setFiles(await ls(currentPath));
    }

    fetch();
  }, [currentPath]);

  useEffect(() => {
    const indexFile = files.find(file => file.name.startsWith("index."));
    if (indexFile) {
      setCurrentFile(indexFile);
    }
  }, [files]);

  const setTarget = useCallback((target: File) => {
    if (target.isDirectory) {
      setCurrentPath(target.path);
    }
    setCurrentFile(target);
  }, []);

  const gotoParentPath = useCallback(() => {
    const o = currentPath.lastIndexOf("/");
    setCurrentPath(currentPath.substring(0, o));
  }, [currentPath]);

  return { files, currentFile, currentPath, setTarget, gotoParentPath };
};

const hookBasedContext = createHookBasedContext(useNavigatorPersistence, defaultValue);

export const NavigatorPersistenceProvider = hookBasedContext.Provider;
export const useNavigatorPersistenceContext = hookBasedContext.useContext;
