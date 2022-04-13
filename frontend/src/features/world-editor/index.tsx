import { File } from '../../lib/fs4webapp-client';
import { WorldView } from './world-view/WorldView-cmp';

const extension = ".world"

const fileLabel: React.FC<{ file: File }> = ({ file }) => <>
  {file.name.substring(0, file.name.length - extension.length)}
</>;

export const fileConfigFor = (file: File) => file.name.endsWith(extension) ? {
    mainView: WorldView,
    fileLabel
} : null;
