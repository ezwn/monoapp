import React, { useEffect, useState } from 'react';
import { useFeatureListContext } from '../app-core/FeatureList-ctx';
import { FileTypeConfig } from '../app-core/FileBasedFeature';
import { FS4JFile } from '../fs4webapp-client';
import { FileLabelCmp } from './FileLabel-cmp';

export const DynamicFileLabel: React.FC<{ file: FS4JFile }> = ({ file }) => {
  const { findFileFeature } = useFeatureListContext();
  const [fileConfig, setFileConfig] = useState<FileTypeConfig | null>(null);

  useEffect(() => {
    setFileConfig(findFileFeature(file)?.fileConfigFor(file) || null);
  }, [findFileFeature, file]);

  return <div>{
    fileConfig ?
      <fileConfig.fileLabelCmp file={file} /> :
      <FileLabelCmp fileTitle={file.name} />
  }</div>;
}
