import React from 'react';
import classNames from 'classnames';
import './MediaFileList-cmp.css';

interface MediaFileCmpProps {
  mediaFile: string;
  playing: boolean;
}

const MediaFileCmp: React.FC<MediaFileCmpProps> = ({ mediaFile, playing }) => {
  return <div className={classNames({ "media-file-cmp": true, playing })}>{mediaFile}</div>;
}

export const MediaFileListCmp = ({ mediaFileList, playedFileOffset }: { mediaFileList: string[], playedFileOffset: number }) => {
  return <div className="media-file-list-cmp">
    {mediaFileList.map(
      (mediaFile, offset) => <MediaFileCmp mediaFile={mediaFile} playing={offset === playedFileOffset} />
    )}
  </div>;
}
