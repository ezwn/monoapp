import { useCallback } from 'react';
import { File } from '../fs4webapp-client';
import { createHookBasedContext } from '../react-utils/createHookBasedContext';
import { FileBasedFeature } from './FileBasedFeature';

export type FeatureListProps = {
  features: FileBasedFeature[];
};

export type FeatureListValue = {
  findFileFeature: (currentFile: File) => FileBasedFeature | null;
  features: FileBasedFeature[];
};

const defaultValue: FeatureListValue = {
  features: [],
  findFileFeature: () => null
};

const useFeatureList: (props: FeatureListProps) => FeatureListValue = ({ features }) => {

  const findFileFeature = useCallback((currentFile: File) => features
    .find(feature => feature.fileConfigFor(currentFile) !== null) || null, [features]);

  return { findFileFeature, features };
}

const hookBasedContext = createHookBasedContext(useFeatureList, defaultValue);

export const FeatureListProvider = hookBasedContext.Provider;
export const useFeatureListContext = hookBasedContext.useContext;
