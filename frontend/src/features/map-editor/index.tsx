import { FileLabelCmp } from '../../lib/file-browsing/FileLabel-cmp';
import { FS4JFile, fileToTitle } from '../../lib/fs4webapp-client';
import { MapView } from './map-view/MapView-cmp';

const extension = ".map.json"

const extractTitle = fileToTitle(extension);

const fileLabelCmp: React.FC<{ file: FS4JFile }> = ({ file }) =>
  <FileLabelCmp fileTitle={extractTitle(file)} />;


export const fileConfigFor = (file: FS4JFile) => file.name.endsWith(extension) ? {
  mainView: MapView,
  tabTitle: extractTitle,
  closable: false,
  fileLabelCmp
} : null;