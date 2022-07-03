import React from 'react';
import { FS4JFile } from '../../lib/fs4webapp-client';
import { useNavigatorPersistenceContext } from '../../lib/file-browsing/NavigatorPersistence-ctx';
import iconImg from '../../lib/media-playing/mp3.png';
import { FileLabelCmp } from '../../lib/file-browsing/FileLabel-cmp';
import { extractMediaFileNameAndExtension, MediaPlayerCmp } from '../../lib/media-playing';

const MediaFilePlayerView = () => {
  const { currentFile } = useNavigatorPersistenceContext();

  if (!currentFile)
    return null;

  return <MediaPlayerCmp filePath={currentFile.path} />;
}

const mainView = () => <MediaFilePlayerView />;

const fileLabelCmp: React.FC<{ file: FS4JFile }> = ({ file }) => {
  const fileNameAndExtension = extractMediaFileNameAndExtension(file.name);

  if (!fileNameAndExtension)
    return null;

  const [fileName] = fileNameAndExtension;

  return <FileLabelCmp iconImg={iconImg} fileTitle={fileName} />;
}

export const fileConfigFor = (file: FS4JFile) => {
  const fileNameAndExtension = extractMediaFileNameAndExtension(file.name);

  if (!fileNameAndExtension)
    return null;

  const [fileName] = fileNameAndExtension;

  return {
    fileLabelCmp,
    tabTitle: () => fileName,
    closable: true,
    mainView
  };
}
