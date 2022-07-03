import React, { useCallback, useEffect, useState } from 'react';
import { FS4JFile, fileToTitle, loadTextFile } from '../../lib/fs4webapp-client';
import { useNavigatorPersistenceContext } from '../../lib/file-browsing/NavigatorPersistence-ctx';
import { MediaFileListCmp } from './MediaFileList-cmp';
import { AudioPlayer } from '../../lib/media-playing/AudioPlayer-cmp';
import iconImg from '../../lib/media-playing/mp3.png';
import { FileLabelCmp } from '../../lib/file-browsing/FileLabel-cmp';

const extension = ".media-list.txt"

const useFileList = (currentFile: FS4JFile | null) => {
  const [list, setList] = useState<string[]>([]);

  const path = currentFile?.path || null;

  useEffect(() => {
    async function loadList() {
      if (path) {
        setList((await loadTextFile(path)).trim().split("\n"));
      }
    }

    loadList();
  }, [path]);

  return list;
};

const MediaListPlayerView = () => {
  const { currentFile } = useNavigatorPersistenceContext();
  const mediaFileList = useFileList(currentFile);

  const [playedFileOffset, setPlayedFileOffset] = useState(0);

  const playNext = useCallback(() => {
    setPlayedFileOffset(playedFileOffset + 1);
  }, [playedFileOffset]);

  const playedFile = mediaFileList[playedFileOffset];

  if (!currentFile || !playedFile)
    return null;

  return <>
    <MediaFileListCmp mediaFileList={mediaFileList} playedFileOffset={playedFileOffset} />
    <AudioPlayer filePath={playedFile} onEnded={playNext} autoPlay={playedFileOffset > 0} />
  </>;
}

const mainView = () => <MediaListPlayerView />;

const extractTitle = fileToTitle(extension);

const fileLabelCmp: React.FC<{ file: FS4JFile }> = ({ file }) =>
  <FileLabelCmp iconImg={iconImg} fileTitle={extractTitle(file)} />;

export const fileConfigFor = (file: FS4JFile) => file.name.endsWith(extension) ? {
  fileLabelCmp,
  tabTitle: extractTitle,
  closable: true,
  mainView
} : null;
