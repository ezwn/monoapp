import React from 'react';

import './FileLabel-cmp.css';

import defaultIconImg from './file.svg';

interface FileLabelCmpProps {
  fileTitle: string;
  iconImg?: string;
}

export const FileLabelCmp: React.FC<FileLabelCmpProps> = ({ fileTitle, iconImg = defaultIconImg }) => {
  return <div className='file-label'>
    <img src={iconImg} className="file-label-icon" alt={fileTitle} />
    {fileTitle}
  </div>;
}
