import { useEffect, useState } from 'react';
import { useNavigatorPersistenceContext } from '../file-browsing/NavigatorPersistence-ctx';
import { createHookBasedContext } from '../react-utils/createHookBasedContext';
import { useFeatureListContext } from './FeatureList-ctx';
import { FileBasedFeature, FileTypeConfig } from './FileBasedFeature';

export type ActiveFeatureProps = {};

export type ActiveFeatureValue = {
  activeFeature: FileBasedFeature | null;
  activeFileConfig: FileTypeConfig | null;
};

const defaultValue: ActiveFeatureValue = {
  activeFeature: null,
  activeFileConfig: null
};

const useActiveFeature: (props: ActiveFeatureProps) => ActiveFeatureValue = () => {

  const [activeFeature, setActiveFeature] = useState<FileBasedFeature | null>(null);
  const [activeFileConfig, setActiveFileConfig] = useState<FileTypeConfig | null>(null);
  const { findFileFeature } = useFeatureListContext();
  const { currentFile } = useNavigatorPersistenceContext();

  useEffect(() => {
    if (!currentFile || !findFileFeature(currentFile)) {
      setActiveFeature(null);
      setActiveFileConfig(null);
      return;
    }

    const fileFeature = findFileFeature(currentFile);
    setActiveFeature(fileFeature);
    const config = fileFeature!.fileConfigFor(currentFile);
    setActiveFileConfig(config);
    
    if (config)
      document.title = config.tabTitle(currentFile);

  }, [currentFile, findFileFeature])

  return { activeFeature, activeFileConfig };
}

const hookBasedContext = createHookBasedContext(useActiveFeature, defaultValue);

export const ActiveFeatureProvider = hookBasedContext.Provider;
export const useActiveFeatureContext = hookBasedContext.useContext;
