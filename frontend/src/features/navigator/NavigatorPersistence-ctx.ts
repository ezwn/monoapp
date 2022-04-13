import { useEffect, useState } from 'react';
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

export const defaultValue: NavigatorPersistenceValue = {
  files: [],
  currentFile: null,
  setTarget: () => { },
  currentPath: "",
  gotoParentPath: () => { },
};

export const useNavigatorPersistence: (props: NavigatorPersistenceProps) => NavigatorPersistenceValue = () => {
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

  const setTarget = (target: File) => {
    if (target.isDirectory) {
      setCurrentPath(target.path);
    }
    setCurrentFile(target);
  }

  const gotoParentPath = () => {
    const o = currentPath.lastIndexOf("/");
    setCurrentPath(currentPath.substring(0, o));
  }

  return { files, currentFile, currentPath, setTarget, gotoParentPath };
};

const hookBasedContext = createHookBasedContext(useNavigatorPersistence, defaultValue);

export const NavigatorPersistenceProvider = hookBasedContext.Provider;
export const useNavigatorPersistenceContext = hookBasedContext.useContext;
