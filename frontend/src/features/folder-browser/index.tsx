import React from 'react';
import { FileLabelCmp } from '../../lib/file-browsing/FileLabel-cmp';
import { FS4JFile } from '../../lib/fs4webapp-client';
import { FolderBrowserCmp } from './FolderBrowser-cmp';

import iconImg from './folder-yellow.svg';

const mainView = () => <FolderBrowserCmp />;

const extractTitle = (file: FS4JFile) => file.name;

const fileLabelCmp: React.FC<{ file: FS4JFile }> = ({ file }) =>
  <FileLabelCmp iconImg={iconImg} fileTitle={extractTitle(file)} />;

export const fileConfigFor = (file: FS4JFile) => file.isDirectory ? {
  fileLabelCmp,
  tabTitle: extractTitle,
  closable: false,
  mainView
} : null;
