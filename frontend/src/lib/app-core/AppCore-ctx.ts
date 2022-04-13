import { File } from '../fs4webapp-client';
import { createHookBasedContext } from '../react-utils/createHookBasedContext';
import { FileBasedFeature, FileTypeConfig } from './FileBasedFeature';

export type AppCoreProps = {
  features: FileBasedFeature[];
};

export type AppCoreValue = {
  findFileTypeSettings: (currentFile: File) => FileTypeConfig | null;
  features: FileBasedFeature[];
};

export const defaultValue: AppCoreValue = {
  features: [],
  findFileTypeSettings: () => null
};

export const useAppCore: (props: AppCoreProps) => AppCoreValue = ({ features }) => {

  const findFileTypeSettings = (currentFile: File) => features
    .map(feature => feature.fileConfigFor(currentFile))
    .find(fileTypeConfig => fileTypeConfig !== null) || null;

  return { findFileTypeSettings, features };
};

const hookBasedContext = createHookBasedContext(useAppCore, defaultValue);

export const AppCoreProvider = hookBasedContext.Provider;
export const useAppCoreContext = hookBasedContext.useContext;
