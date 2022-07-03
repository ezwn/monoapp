import { FileLabelCmp } from '../../lib/file-browsing/FileLabel-cmp';
import { FS4JFile, fileToTitle } from '../../lib/fs4webapp-client';
import { WorldView } from './world-view/WorldView-cmp';

const extension = ".world"

const extractTitle = fileToTitle(extension);

const fileLabelCmp: React.FC<{ file: FS4JFile }> = ({ file }) =>
  <FileLabelCmp fileTitle={extractTitle(file)} />;

export const fileConfigFor = (file: FS4JFile) => file.name.endsWith(extension) ? {
  mainView: WorldView,
  closable: false,
  tabTitle: extractTitle,
  fileLabelCmp
} : null;
